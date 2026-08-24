const LEAD_HEADERS = [
  "lead_id",
  "submitted_at",
  "lead_tier",
  "lead_score",
  "need_type",
  "org_type",
  "quantity",
  "timeline",
  "budget",
  "region",
  "name",
  "phone",
  "company",
  "note",
  "source",
  "page_url",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "status",
  "owner",
  "follow_up_at",
  "telegram_status",
  "telegram_ms",
  "sheet_ms",
  "total_ms",
  "product_code",
  "product_name",
  "product_category"
];

function doPost(event) {
  const requestStarted = Date.now();
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    if (payload.website) return jsonResponse({ ok: true });
    if (!payload.name || !payload.phone || !payload.need_type) {
      return jsonResponse({ ok: false, error: "MISSING_REQUIRED_FIELDS" });
    }

    const lead = normalizeLead(payload);
    enforceRateLimit(lead.phone);
    const telegram = sendTelegramLead(lead);
    lead.telegram_status = telegram.status;
    lead.telegram_ms = telegram.ms;
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      appendLeadToSheet(lead, requestStarted);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true, lead_id: lead.lead_id, total_ms: lead.total_ms });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error.message || error) });
  }
}

function enforceRateLimit(phone) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(phone));
  const key = "lead_" + Utilities.base64EncodeWebSafe(digest).slice(0, 32);
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) throw new Error("RATE_LIMITED");
  cache.put(key, "1", 60);
}

function normalizeLead(payload) {
  const clean = {};
  LEAD_HEADERS.forEach((key) => {
    clean[key] = sanitize(payload[key]);
  });
  clean.product_code = normalizeProductCode(payload.product_code);
  clean.product_name = clean.product_code ? sanitize(payload.product_name).trim() : "";
  clean.product_category = normalizeProductCategory(payload.product_category);
  clean.lead_id = "BA-" + Utilities.getUuid().slice(0, 8).toUpperCase();
  clean.submitted_at = payload.submitted_at || new Date().toISOString();
  clean.status = "New";
  clean.owner = "";
  clean.follow_up_at = "";

  const scored = scoreLead(clean);
  clean.lead_score = scored.score;
  clean.lead_tier = scored.tier;
  return clean;
}

function scoreLead(lead) {
  const maps = {
    need_type: { office: 16, school: 14, factory: 18, project: 20 },
    org_type: { business: 10, contractor: 12, school: 8, individual: 2 },
    quantity: { under10: 3, "10-29": 8, "30-99": 14, "100plus": 20 },
    timeline: { "30days": 20, "1-3months": 14, "3plus": 7, researching: 2 },
    budget: { unknown: 5, under50: 4, "50-200": 10, "200-500": 15, "500plus": 20 }
  };
  let score = Object.keys(maps).reduce((sum, field) => sum + (maps[field][lead[field]] || 0), 0);
  const region = String(lead.region || "").toLowerCase();
  const priority = ["nam định", "ninh bình", "hà nam", "hưng yên", "thái bình"];
  score += priority.some((item) => region.indexOf(item) >= 0) ? 10 : 6;
  score = Math.min(score, 100);
  return { score: score, tier: score >= 60 ? "HOT" : score >= 38 ? "WARM" : "NEW" };
}

function appendLeadToSheet(lead, requestStarted) {
  const properties = PropertiesService.getScriptProperties();
  const sheetId = properties.getProperty("SHEET_ID");
  const sheetName = properties.getProperty("SHEET_NAME") || "Leads";
  if (!sheetId) throw new Error("SHEET_ID_NOT_CONFIGURED");

  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  const sheetHeaders = ensureLeadHeaders(sheet);
  const sheetStarted = Date.now();
  const rowValues = sheetHeaders.map((key) => {
    if (key === "submitted_at") return new Date(lead.submitted_at);
    return lead[key] || "";
  });
  sheet.appendRow(rowValues);
  const row = sheet.getLastRow();
  lead.sheet_ms = Date.now() - sheetStarted;
  lead.total_ms = Date.now() - requestStarted;
  sheet.getRange(row, 2).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  const phoneColumn = sheetHeaders.indexOf("phone") + 1;
  sheet.getRange(row, phoneColumn).setNumberFormat("@").setValue(String(lead.phone));
  sheet.getRange(row, sheetHeaders.indexOf("sheet_ms") + 1).setValue(lead.sheet_ms);
  sheet.getRange(row, sheetHeaders.indexOf("total_ms") + 1).setValue(lead.total_ms);
}

function ensureLeadHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    if (sheet.getMaxColumns() < LEAD_HEADERS.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), LEAD_HEADERS.length - sheet.getMaxColumns());
    }
    sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setValues([LEAD_HEADERS]);
    return LEAD_HEADERS.slice();
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function (value) {
    return String(value || "").trim();
  });
  const missingHeaders = LEAD_HEADERS.filter(function (header) {
    return currentHeaders.indexOf(header) < 0;
  });
  if (!missingHeaders.length) return currentHeaders;

  const requiredColumns = currentHeaders.length + missingHeaders.length;
  if (sheet.getMaxColumns() < requiredColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), requiredColumns - sheet.getMaxColumns());
  }
  sheet.getRange(1, currentHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
  return currentHeaders.concat(missingHeaders);
}

function sendTelegramLead(lead) {
  const properties = PropertiesService.getScriptProperties();
  const token = properties.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = properties.getProperty("TELEGRAM_CHAT_ID");
  if (!token || !chatId) throw new Error("TELEGRAM_NOT_CONFIGURED");

  const source = lead.utm_source || lead.source || "website";
  const attributionLines = ["Nguồn: " + formatAttributionSource(source)];
  if (lead.utm_campaign) attributionLines.push("Campaign: " + lead.utm_campaign);
  if (lead.utm_content) attributionLines.push("Content: " + lead.utm_content);
  const productLine = formatProductContextLine(lead);

  const text = [
    lead.lead_tier === "HOT" ? "LEAD HOT BAFurniture" : "Lead mới BAFurniture",
    "ID: " + lead.lead_id,
    "Điểm: " + lead.lead_score + " / " + lead.lead_tier,
    "Nhu cầu: " + lead.need_type,
    "Khách hàng: " + lead.org_type,
    "Quy mô: " + lead.quantity,
    "Thời gian: " + lead.timeline,
    "Khu vực: " + lead.region,
    "Tên: " + lead.name,
    "Điện thoại: " + lead.phone,
    "Đơn vị: " + (lead.company || "—"),
    ...(productLine ? [productLine] : []),
    "Ghi chú: " + (lead.note || "—"),
    ...attributionLines
  ].join("\n");

  const started = Date.now();
  const response = UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ chat_id: chatId, text: text }),
    muteHttpExceptions: true
  });
  const code = response.getResponseCode();
  if (code < 200 || code >= 300) throw new Error("TELEGRAM_HTTP_" + code);
  return { status: "SENT", ms: Date.now() - started };
}

function formatAttributionSource(value) {
  const source = String(value || "");
  return source.toLowerCase() === "facebook" ? "Facebook" : source;
}

function formatProductContextLine(lead) {
  const code = String(lead.product_code || "").trim();
  const name = String(lead.product_name || "").trim();
  const category = String(lead.product_category || "").trim();
  if (code) return "Sản phẩm: " + code + (name ? " — " + name : "");
  if (category) return "Nhóm: " + formatProductCategory(category);
  return "";
}

function formatProductCategory(value) {
  const category = normalizeProductCategory(value);
  const labels = {
    "ghe-luoi-lung-cao": "Ghế lưới lưng cao",
    "ghe-giam-doc": "Ghế giám đốc"
  };
  if (labels[category]) return labels[category];
  const readable = category.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return readable ? readable.charAt(0).toUpperCase() + readable.slice(1) : "";
}

function normalizeProductCode(value) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9._-]{0,79}$/.test(code) ? code : "";
}

function normalizeProductCategory(value) {
  const category = String(value || "").trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category) ? category.slice(0, 120) : "";
}

function sanitize(value) {
  return String(value == null ? "" : value).replace(/^[=+\-@]/, "'").slice(0, 2000);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
