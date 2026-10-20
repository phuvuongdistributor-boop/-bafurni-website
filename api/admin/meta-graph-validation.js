"use strict";

const EXPECTED_PAGE_ID = "553082647894185";
const DEFAULT_GRAPH_VERSION = "v26.0";
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_DIAGNOSTIC_TEXT = 300;

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  if (typeof res.setHeader === "function") {
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
  }
  res.end(JSON.stringify(body));
}

function cleanText(value, secrets = []) {
  if (value === undefined || value === null) return null;
  let text = String(value).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  for (const secret of secrets) {
    if (secret) text = text.split(String(secret)).join("[REDACTED]");
  }
  text = text.replace(/([?&](?:access_token|token)=)[^&\s]+/gi, "$1[REDACTED]");
  return text.slice(0, MAX_DIAGNOSTIC_TEXT) || null;
}

function requestId(req) {
  return cleanText(
    req?.headers?.["x-vercel-id"] ||
      req?.headers?.["x-request-id"] ||
      req?.headers?.["x-correlation-id"],
  );
}

function responseHeader(response, name) {
  return typeof response?.headers?.get === "function" ? cleanText(response.headers.get(name)) : null;
}

function classifyGraphError(error) {
  const code = Number(error?.code);
  if (code === 190) return "TOKEN_INVALID_OR_EXPIRED";
  if ([10, 200, 2500].includes(code)) return "PAGE_PERMISSION_ERROR";
  if (code === 100) return "GRAPH_PARAMETER_ERROR";
  return "GRAPH_API_ERROR";
}

function diagnostic(response, payload, req, pageToken) {
  const error = payload && typeof payload.error === "object" ? payload.error : null;
  const graphCode = Number.isFinite(Number(error?.code)) ? Number(error.code) : null;
  const graphSubcode = Number.isFinite(Number(error?.error_subcode))
    ? Number(error.error_subcode)
    : null;
  return {
    category: error ? classifyGraphError(error) : "GRAPH_HTTP_ERROR",
    http_status: Number(response?.status) || null,
    graph_code: graphCode,
    graph_subcode: graphSubcode,
    error_type: cleanText(error?.type, [pageToken]),
    error_message: cleanText(error?.message, [pageToken]),
    meta_trace_id: cleanText(error?.fbtrace_id, [pageToken]) || responseHeader(response, "x-fb-trace-id"),
    vercel_request_id: requestId(req),
  };
}

function createMetaGraphValidationHandler({
  fetchImpl = globalThis.fetch,
  env = process.env,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  return async function metaGraphValidation(req, res) {
    if (req.method !== "GET") {
      return json(res, 405, { status: "FAIL", code: "METHOD_NOT_ALLOWED" });
    }

    const internalKey = req.headers?.["x-meta-validation-key"] || req.headers?.["x-internal-validation-key"];
    const configuredKey = env.META_VALIDATION_KEY || env.CRON_SECRET;
    if (!configuredKey || !internalKey || internalKey !== configuredKey) {
      return json(res, 401, { status: "FAIL", code: "INTERNAL_AUTH_REQUIRED" });
    }

    const pageId = String(env.META_PAGE_ID || "");
    const graphVersion = String(env.META_GRAPH_VERSION || DEFAULT_GRAPH_VERSION);
    const pageToken = String(env.META_PAGE_ACCESS_TOKEN || "");

    if (!pageToken) {
      return json(res, 503, { status: "FAIL", code: "PAGE_TOKEN_MISSING" });
    }
    if (pageId !== EXPECTED_PAGE_ID) {
      return json(res, 503, { status: "FAIL", code: "PAGE_ID_CONFIG_MISMATCH" });
    }
    if (typeof fetchImpl !== "function") {
      return json(res, 503, { status: "FAIL", code: "FETCH_UNAVAILABLE" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const url = `https://graph.facebook.com/${encodeURIComponent(graphVersion)}/${encodeURIComponent(pageId)}?fields=id%2Cname`;
      const response = await fetchImpl(url, {
        method: "GET",
        headers: { authorization: `Bearer ${pageToken}` },
        signal: controller.signal,
      });

      let payload = null;
      let parseError = false;
      try {
        payload = await response.json();
      } catch (_error) {
        parseError = true;
      }

      if (!response.ok || !payload || payload.error) {
        const details = diagnostic(response, payload, req, pageToken);
        if (parseError) details.parse_error = "NON_JSON_RESPONSE";
        return json(res, 502, { status: "FAIL", code: "GRAPH_API_ERROR", details });
      }
      if (String(payload.id || "") !== EXPECTED_PAGE_ID) {
        return json(res, 502, {
          status: "FAIL",
          code: "PAGE_ID_MISMATCH",
          details: {
            category: "PAGE_ID_MISMATCH",
            http_status: Number(response.status) || null,
            observed_page_id: cleanText(payload.id, [pageToken]),
            vercel_request_id: requestId(req),
          },
        });
      }

      return json(res, 200, {
        status: "PASS",
        page: { id: EXPECTED_PAGE_ID, name: String(payload.name || "") },
        graph_version: graphVersion,
      });
    } catch (error) {
      return json(res, 502, {
        status: "FAIL",
        code: error?.name === "AbortError" ? "GRAPH_API_TIMEOUT" : "GRAPH_API_UNAVAILABLE",
        details: {
          category: error?.name === "AbortError" ? "TIMEOUT" : "NETWORK_OR_TLS_ERROR",
          error_type: cleanText(error?.name, [pageToken]),
          error_message: cleanText(error?.message, [pageToken]),
          vercel_request_id: requestId(req),
        },
      });
    } finally {
      clearTimeout(timeout);
    }
  };
}

module.exports = createMetaGraphValidationHandler();
module.exports.createMetaGraphValidationHandler = createMetaGraphValidationHandler;
module.exports.EXPECTED_PAGE_ID = EXPECTED_PAGE_ID;
