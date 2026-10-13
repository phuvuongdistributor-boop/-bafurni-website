"use strict";

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  if (typeof res.setHeader === "function") {
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
  }
  res.end(JSON.stringify(body));
}

function createFacebookWorkerHandler({ env = process.env } = {}) {
  return async function facebookWorker(req, res) {
    if (req.method !== "GET") {
      return json(res, 405, { status: "FAIL", code: "METHOD_NOT_ALLOWED" });
    }

    const internalKey = req.headers?.["x-meta-validation-key"] || req.headers?.["x-internal-validation-key"];
    const configuredKey = env.META_VALIDATION_KEY || env.CRON_SECRET;
    if (!configuredKey || !internalKey || internalKey !== configuredKey) {
      return json(res, 401, { status: "FAIL", code: "INTERNAL_AUTH_REQUIRED" });
    }

    // Production scaffold is intentionally read-only until explicit activation.
    // There is no Facebook transport, queue mutation, scheduler, or POST path here.
    return json(res, 200, {
      status: "DISABLED",
      publish_enabled: false,
      scheduler: "OFF",
      queue: "INACTIVE",
      transport_posts: 0,
    });
  };
}

module.exports = createFacebookWorkerHandler();
module.exports.createFacebookWorkerHandler = createFacebookWorkerHandler;
