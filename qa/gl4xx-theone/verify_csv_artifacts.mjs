import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Workbook } from "@oai/artifact-tool";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");

const specs = [
  {
    id: "seo_keyword_map",
    file: "PACKAGE_MESH_MEETING_GL4XX_THEONE/seo/GL4XX_SEO_KEYWORD_MAP.csv",
    rows: 30,
    columns: 7,
    key: "TargetURL",
    allowDuplicateKey: true
  },
  {
    id: "seo_page_map",
    file: "PACKAGE_MESH_MEETING_GL4XX_THEONE/seo/GL4XX_SEO_PAGE_MAP.csv",
    rows: 25,
    columns: 11,
    key: "URL"
  },
  {
    id: "zalo_selection",
    file: "PACKAGE_MESH_MEETING_GL4XX_THEONE/marketing/zalo/ZALO_SELECTED_PRODUCTS.csv",
    rows: 8,
    columns: 20,
    key: "Code"
  }
];

const results = [];
for (const spec of specs) {
  const absolute = path.join(ROOT, spec.file.replaceAll("/", path.sep));
  const csvText = await fs.readFile(absolute, "utf8");
  const workbook = await Workbook.fromCSV(csvText, { sheetName: spec.id });
  const sheet = workbook.worksheets.getItem(spec.id);
  const used = sheet.getUsedRange(true);
  const values = used.values;
  const headers = values[0].map((value) => String(value ?? "").replace(/^\uFEFF/, ""));
  const rows = values.slice(1);
  const keyIndex = headers.indexOf(spec.key);
  const keys = keyIndex >= 0 ? rows.map((row) => String(row[keyIndex] ?? "")) : [];
  const blankRows = rows.filter((row) => row.every((value) => String(value ?? "").trim() === "")).length;
  const inspect = await workbook.inspect({
    kind: "table",
    sheetId: spec.id,
    range: used.address,
    include: "values",
    tableMaxRows: 4,
    tableMaxCols: spec.columns,
    maxChars: 3000
  });

  results.push({
    id: spec.id,
    file: spec.file,
    utf8Bom: csvText.charCodeAt(0) === 0xfeff,
    rows: rows.length,
    expectedRows: spec.rows,
    columns: headers.length,
    expectedColumns: spec.columns,
    headers,
    key: spec.key,
    blankRows,
    duplicateKeys: keys.length - new Set(keys).size,
    inspectionAvailable: Boolean(inspect?.ndjson),
    pass:
      rows.length === spec.rows &&
      headers.length === spec.columns &&
      blankRows === 0 &&
      keyIndex >= 0 &&
      keys.every(Boolean) &&
      (spec.allowDuplicateKey || keys.length === new Set(keys).size)
  });
}

const report = {
  status: results.every((result) => result.pass) ? "PASS" : "FAIL",
  parser: "@oai/artifact-tool Workbook.fromCSV",
  results
};

await fs.writeFile(
  path.join(ROOT, "PACKAGE_MESH_MEETING_GL4XX_THEONE", "qa", "CSV_ARTIFACT_VALIDATION.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8"
);
console.log(JSON.stringify(report, null, 2));
if (report.status !== "PASS") process.exit(1);
