"use strict";

const EXPECTED_PAGE_ID = "553082647894185";
const DEFAULT_GRAPH_VERSION = "v26.0";
const DEFAULT_TIMEOUT_MS = 8000;

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  if (typeof res.setHeader === "function") {
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
  }
  res.end(JSON.stringify(body));
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
      try {
        payload = await response.json();
      } catch (_error) {
        payload = null;
      }

      if (!response.ok || !payload || payload.error) {
        return json(res, 502, { status: "FAIL", code: "GRAPH_API_ERROR" });
      }
      if (String(payload.id || "") !== EXPECTED_PAGE_ID) {
        return json(res, 502, { status: "FAIL", code: "PAGE_ID_MISMATCH" });
      }

      return json(res, 200, {
        status: "PASS",
        page: { id: EXPECTED_PAGE_ID, name: String(payload.name || "") },
        graph_version: graphVersion,
      });
    } catch (error) {
      const code = error?.name === "AbortError" ? "GRAPH_API_TIMEOUT" : "GRAPH_API_UNAVAILABLE";
      return json(res, 502, { status: "FAIL", code });
    } finally {
      clearTimeout(timeout);
    }
  };
}

module.exports = createMetaGraphValidationHandler();
module.exports.createMetaGraphValidationHandler = createMetaGraphValidationHandler;
module.exports.EXPECTED_PAGE_ID = EXPECTED_PAGE_ID;
