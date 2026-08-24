const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function runSiteShellContextTests() {
  const body = { dataset: {} };
  const document = {
    body,
    documentElement: { dataset: {} },
    querySelector: () => null
  };
  const window = {};
  const context = vm.createContext({ document, window });
  vm.runInContext(read("site-shell.js"), context);

  const shell = window.BASiteShell;
  assert.ok(shell, "BASiteShell must be exposed");

  let result = shell.setContext({
    pageType: "campaign_category",
    productCode: "",
    productName: "",
    productCategory: "ghe-luoi-lung-cao",
    categoryName: "Ghế lưới lưng cao The One"
  });
  assert.equal(result.productCategory, "ghe-luoi-lung-cao");
  assert.equal(result.productCode, "");

  result = shell.setContext({
    pageType: "product_detail",
    productCode: "GL304",
    productName: "Ghế Lưới Trưởng Phòng The One GL304",
    productCategory: "ghe-luoi-lung-cao"
  });
  assert.equal(result.productCode, "GL304");
  assert.equal(result.productName, "Ghế Lưới Trưởng Phòng The One GL304");

  result = shell.setContext({
    productCode: "GL345",
    productName: "Ghế lưới lưng cao The One GL345",
    productCategory: "ghe-luoi-lung-cao"
  });
  assert.equal(result.productCode, "GL345", "new product page must replace the previous code");
  assert.equal(result.productName, "Ghế lưới lưng cao The One GL345");

  result = shell.setContext({
    pageType: "homepage",
    productCode: "",
    productName: "",
    productCategory: "",
    categoryName: ""
  });
  assert.equal(result.productCode, "");
  assert.equal(result.productName, "");
  assert.equal(result.productCategory, "");
}

function runAppsScriptContractTests() {
  const utilities = {
    getUuid: () => "c429005e-0000-0000-0000-000000000000"
  };
  const context = vm.createContext({
    Utilities: utilities,
    console,
    Date,
    String,
    Math,
    Object,
    Array
  });
  vm.runInContext(read("integrations/google-apps-script/Code.gs"), context);

  const headers = vm.runInContext("LEAD_HEADERS.slice()", context);
  assert.deepEqual(
    Array.from(headers.slice(-3)),
    ["product_code", "product_name", "product_category"],
    "product context columns must append after the legacy contract"
  );
  assert.equal(headers.indexOf("total_ms"), 27, "legacy A:AB order must remain unchanged");

  const payload = {
    name: "TEST-M1C",
    phone: "0929878666",
    need_type: "office",
    product_code: "GL304",
    product_name: "Ghế Lưới Trưởng Phòng The One GL304",
    product_category: "ghe-luoi-lung-cao",
    utm_source: "facebook",
    utm_medium: "social",
    utm_campaign: "gl3xx_theone",
    utm_content: "group_post_01"
  };
  context.__payload = payload;
  const normalized = vm.runInContext("normalizeLead(__payload)", context);
  assert.equal(normalized.product_code, "GL304");
  assert.equal(normalized.product_name, payload.product_name);
  assert.equal(normalized.product_category, "ghe-luoi-lung-cao");
  assert.equal(normalized.utm_source, "facebook");
  assert.equal(normalized.utm_medium, "social");
  assert.equal(normalized.utm_campaign, "gl3xx_theone");
  assert.equal(normalized.utm_content, "group_post_01");

  context.__payload = {
    name: "TEST-M1C",
    phone: "0929878666",
    need_type: "office",
    product_code: "",
    product_name: "Tên không được giữ khi chưa có mã",
    product_category: "GHE-LUOI-LUNG-CAO"
  };
  const categoryOnly = vm.runInContext("normalizeLead(__payload)", context);
  assert.equal(categoryOnly.product_code, "");
  assert.equal(categoryOnly.product_name, "", "category-only lead must not keep an orphan product name");
  assert.equal(categoryOnly.product_category, "ghe-luoi-lung-cao");

  context.__lead = normalized;
  assert.equal(
    vm.runInContext("formatProductContextLine(__lead)", context),
    "Sản phẩm: GL304 — Ghế Lưới Trưởng Phòng The One GL304"
  );
  context.__lead = { product_code: "", product_name: "", product_category: "ghe-luoi-lung-cao" };
  assert.equal(vm.runInContext("formatProductContextLine(__lead)", context), "Nhóm: Ghế lưới lưng cao");
  context.__lead = { product_code: "", product_name: "", product_category: "" };
  assert.equal(vm.runInContext("formatProductContextLine(__lead)", context), "");

  const legacyHeaders = Array.from(headers.slice(0, -3));
  let sheetHeaders = legacyHeaders.slice();
  let maxColumns = sheetHeaders.length;
  const sheet = {
    getLastRow: () => 11,
    getLastColumn: () => sheetHeaders.length,
    getMaxColumns: () => maxColumns,
    insertColumnsAfter: (_after, count) => { maxColumns += count; },
    getRange: (_row, column, _rows, columns) => ({
      getValues: () => [sheetHeaders.slice(column - 1, column - 1 + columns)],
      setValues: (values) => {
        values[0].forEach((value, index) => {
          sheetHeaders[column - 1 + index] = value;
        });
      }
    })
  };
  context.__sheet = sheet;
  const ensured = vm.runInContext("ensureLeadHeaders(__sheet)", context);
  assert.deepEqual(Array.from(ensured.slice(-3)), ["product_code", "product_name", "product_category"]);
  assert.equal(maxColumns, 31);
  assert.deepEqual(sheetHeaders.slice(0, 28), legacyHeaders, "old columns must not move");
}

function runStaticIntegrationTests() {
  const leadEngine = read("lead-engine.js");
  const attribution = read("lead-attribution.js");
  const homepage = read("index.html");
  const meshLanding = read("mesh-highback-gl3xx.html");
  const meshProduct = read("mesh-highback-product.html");

  assert.match(leadEngine, /"product_category"/, "lead engine must collect product_category");
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((field) => {
    assert.match(attribution, new RegExp(`"${field}"`), `M1A must keep ${field}`);
  });
  assert.match(homepage, /name="product_code"/);
  assert.match(homepage, /name="product_name"/);
  assert.match(homepage, /name="product_category"/);
  assert.match(meshLanding, /data-product-category="ghe-luoi-lung-cao"/);
  assert.match(meshProduct, /data-product-category="ghe-luoi-lung-cao"/);

  const dataContext = vm.createContext({ window: {} });
  vm.runInContext(read("mesh-highback-gl3xx-data.js"), dataContext);
  const gl304 = dataContext.window.BA_V10_MESH_HIGHBACK_CHAIRS.find((item) => item.code === "GL304");
  const gl345 = dataContext.window.BA_V10_MESH_HIGHBACK_CHAIRS.find((item) => item.code === "GL345");
  assert.equal(gl304.name, "Ghế Lưới Trưởng Phòng The One GL304");
  assert.equal(gl345.name, "Ghế lưới lưng cao The One GL345");
}

runSiteShellContextTests();
runAppsScriptContractTests();
runStaticIntegrationTests();
console.log("M1C product-context mock QA: PASS (landing, GL304, GL304→GL345, homepage, Sheet headers, Telegram, UTM)");
