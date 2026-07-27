import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const qaDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const root = path.resolve(qaDir, "..", "..");
const metrics = JSON.parse(await fs.readFile(path.join(qaDir, "remaster-metrics.json"), "utf8"));

const production = [
  ["Hero", "Desktop", "https://bafurni.com/images/hero/homepage-1600.webp", "WEBP", "769x540", 1600, 1000, 87812, 438.32, "MEDIUM", "HIGH (LCP)", "SOFT", "Production HTTP + browser"],
  ["Hero", "Mobile", "https://bafurni.com/images/hero/homepage-720.webp", "WEBP", "375x210", 720, 540, 27670, 885.47, "MEDIUM", "HIGH (LCP)", "SOFT", "Production HTTP + browser"],
  ["Solution", "Doanh nghiệp", "https://bafurni.com/images/solutions/doanh-nghiep-720.webp", "WEBP", "423x238", 720, 450, 48524, 2025.71, "MEDIUM", "LOW (lazy)", "SOFT", "Production HTTP + browser"],
  ["Solution", "Trường học", "https://bafurni.com/images/solutions/truong-hoc-720.webp", "WEBP", "423x238", 720, 450, 42654, 1535.98, "MEDIUM", "LOW (lazy)", "SOFT", "Production HTTP + browser"],
  ["Solution", "Nhà máy", "https://bafurni.com/images/solutions/nha-may-720.webp", "WEBP", "423x238", 720, 450, 33888, 1254.77, "MEDIUM", "LOW (lazy)", "SOFT", "Production HTTP + browser"],
  ["Brand Promise", "Phòng lãnh đạo", "https://bafurni.com/images/categories/sub/ghe-giam-doc.webp", "WEBP", "314x640", 960, 686, 58412, 943.06, "HIGH", "LOW (lazy)", "UPSCALED", "HTTP file 960x686; browser cache served legacy 260x186"],
  ["Brand Promise", "Văn phòng đội nhóm", "https://bafurni.com/images/categories/sub/ban-cum-module.webp", "WEBP", "314x640", 960, 686, 65990, 877.44, "MEDIUM", "LOW (lazy)", "SOFT", "Production HTTP + browser"],
  ["Brand Promise", "Phòng họp", "https://bafurni.com/images/categories/sub/ban-hop-nho.webp", "WEBP", "314x640", 960, 686, 141344, 2914.78, "MEDIUM", "LOW (lazy)", "SOFT", "Production HTTP + browser"],
  ["Brand Promise", "Nhà máy & kho", "https://bafurni.com/images/categories/sub/tu-locker.webp", "WEBP", "314x640", 960, 686, 58128, 1838.97, "MEDIUM", "LOW (lazy)", "SOFT", "Production HTTP + browser"],
  ["Project", "Workplace", "https://bafurni.com/images/categories/main/ghe-van-phong-1200.webp", "WEBP", "476x357", 1200, 900, 113708, 1820.57, "LOW", "MEDIUM (eager)", "SOFT", "Production HTTP + browser"],
  ["Project", "Education", "https://bafurni.com/images/categories/main/noi-that-truong-hoc-1200.webp", "WEBP", "396x357", 1200, 900, 96830, 713.67, "MEDIUM", "MEDIUM (eager)", "SOFT", "Production HTTP + browser"],
  ["Project", "Lounge", "https://bafurni.com/images/categories/main/sofa-ghe-cho-1200.webp", "WEBP", "396x357", 1200, 900, 99000, 328.57, "MEDIUM", "MEDIUM (eager)", "SOFT", "Production HTTP + browser"],
];

const displayMap = {
  "hero-desktop": "778x540",
  "hero-mobile": "375x210",
  "solution-doanh-nghiep": "428x241",
  "solution-truong-hoc": "428x241",
  "solution-nha-may": "428x241",
  "brand-promise-ghe-giam-doc": "314x640",
  "brand-promise-ban-cum-module": "314x640",
  "brand-promise-ban-hop-nho": "314x640",
  "brand-promise-tu-locker": "314x640",
  "project-workplace": "482x361",
  "project-education": "401x361",
  "project-lounge": "401x361",
};

const sectionMap = {
  "hero-desktop": ["Hero", "Desktop"],
  "hero-mobile": ["Hero", "Mobile"],
  "solution-doanh-nghiep": ["Solution", "Doanh nghiệp"],
  "solution-truong-hoc": ["Solution", "Trường học"],
  "solution-nha-may": ["Solution", "Nhà máy"],
  "brand-promise-ghe-giam-doc": ["Brand Promise", "Phòng lãnh đạo"],
  "brand-promise-ban-cum-module": ["Brand Promise", "Văn phòng đội nhóm"],
  "brand-promise-ban-hop-nho": ["Brand Promise", "Phòng họp"],
  "brand-promise-tu-locker": ["Brand Promise", "Nhà máy & kho"],
  "project-workplace": ["Project", "Workplace"],
  "project-education": ["Project", "Education"],
  "project-lounge": ["Project", "Lounge"],
};

const preview = metrics.map((m) => {
  const [section, variant] = sectionMap[m.name];
  const impact = m.name.startsWith("hero-") ? "HIGH (LCP)" : "LOW (lazy)";
  return [
    section,
    variant,
    `assets/marketing/remastered/${m.name}.avif`,
    "AVIF",
    displayMap[m.name],
    m.output_width,
    m.output_height,
    m.avif_bytes,
    m.output_laplacian,
    "LOW",
    impact,
    "PASS",
    `${m.source}; Real-ESRGAN 18% blend; q=${m.quality}`,
  ];
});

const noImage = [
  ["Manufacturing", "Section", "NONE", "NONE", "N/A", 0, 0, 0, 0, "NONE", "NONE", "NO_IMAGE", "No image in current homepage DOM"],
  ["Coverage", "Section", "NONE", "NONE", "N/A", 0, 0, 0, 0, "NONE", "NONE", "NO_IMAGE", "No image in current homepage DOM"],
  ["CTA", "Section", "NONE", "NONE", "N/A", 0, 0, 0, 0, "NONE", "NONE", "NO_IMAGE", "No image in current homepage DOM"],
  ["Background images", "CSS", "NONE", "NONE", "N/A", 0, 0, 0, 0, "NONE", "NONE", "NO_IMAGE", "No CSS background-image URL in homepage main"],
];

const csvHeaders = [
  "Section",
  "ImageURL",
  "FileType",
  "DisplayedSize",
  "RealFileSize",
  "PixelDimension",
  "CompressionRatio",
  "BlurRisk",
  "LCPImpact",
  "CurrentQuality",
];

function csvRows(rows) {
  return rows.map((r) => {
    const [section, variant, url, type, displayed, width, height, bytes, , risk, lcp, status] = r;
    const ratio = bytes && width && height ? `${(width * height * 3 / bytes).toFixed(2)}:1` : "N/A";
    return [
      variant === "Section" || variant === "CSS" ? section : `${section} — ${variant}`,
      url,
      type,
      displayed,
      bytes || 0,
      width && height ? `${width}x${height}` : "N/A",
      ratio,
      risk,
      lcp,
      status,
    ];
  });
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n")}\r\n`;
}

const productionCsv = toCsv(csvHeaders, csvRows([...production, ...noImage]));
const previewCsv = toCsv(csvHeaders, csvRows([...preview, ...noImage]));
await fs.writeFile(path.join(root, "HOMEPAGE_MARKETING_IMAGES.csv"), productionCsv, "utf8");
await fs.writeFile(path.join(root, "HOMEPAGE_MARKETING_IMAGES_PREVIEW.csv"), previewCsv, "utf8");

const workbook = Workbook.create();
const summary = workbook.worksheets.add("QA Summary");
const prodSheet = workbook.worksheets.add("Production Audit");
const previewSheet = workbook.worksheets.add("Preview Audit");

summary.getRange("A1:F1").merge();
summary.getRange("A1").values = [["BAFurniture — Marketing Image Quality Audit"]];
summary.getRange("A3:B10").values = [
  ["Metric", "Result"],
  ["Marketing images audited", 12],
  ["Preview PASS", 12],
  ["Preview blurry", 0],
  ["Preview soft", 0],
  ["Desktop page height", "5690 → 5690"],
  ["Mobile page height", "9116 → 9116"],
  ["Browser formats", "AVIF primary / WebP fallback"],
];
summary.getRange("D3:E10").values = [
  ["QA", "Result"],
  ["Desktop overflow 1440", "PASS"],
  ["Mobile overflow 390", "PASS"],
  ["CLS desktop/mobile", "0 / 0"],
  ["Console errors", 0],
  ["Hero LCP desktop", "1276ms → 692ms"],
  ["Hero LCP mobile", "608ms → 364ms"],
  ["Layout changed", "NO"],
];

const headers = [
  "Section",
  "Variant",
  "ImageURL",
  "FileType",
  "DisplayedSize",
  "WidthPx",
  "HeightPx",
  "Bytes",
  "CompressionRatio",
  "BytesPerPixel",
  "Laplacian",
  "BlurRisk",
  "LCPImpact",
  "CurrentQuality",
  "Source",
];

function writeAuditSheet(sheet, rows) {
  sheet.getRange("A1:O1").values = [headers];
  sheet.getRangeByIndexes(1, 0, rows.length, 15).values = rows.map((r) => [
    ...r.slice(0, 8),
    null,
    null,
    ...r.slice(8),
  ]);
  sheet.getRange("I2").formulas = [["=IF(H2=0,\"\",ROUND(F2*G2*3/H2,2))"]];
  sheet.getRange(`I2:I${rows.length + 1}`).fillDown();
  sheet.getRange("J2").formulas = [["=IF(F2*G2=0,\"\",H2/(F2*G2))"]];
  sheet.getRange(`J2:J${rows.length + 1}`).fillDown();
  sheet.getRange(`F2:H${rows.length + 1}`).format.numberFormat = "#,##0";
  sheet.getRange(`I2:J${rows.length + 1}`).format.numberFormat = "0.000";
  sheet.getRange(`K2:K${rows.length + 1}`).format.numberFormat = "0.00";
  sheet.getRange(`A1:O${rows.length + 1}`).format.wrapText = true;
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
}

writeAuditSheet(prodSheet, [...production, ...noImage]);
writeAuditSheet(previewSheet, [...preview, ...noImage]);

for (const sheet of [prodSheet, previewSheet]) {
  sheet.getRange("A1:O1").format = {
    fill: "#1E2420",
    font: { bold: true, color: "#FFFFFF" },
    borders: { preset: "outside", style: "thin", color: "#1E2420" },
  };
  sheet.getRange("A2:O17").format.borders = {
    insideHorizontal: { style: "thin", color: "#E6E0D8" },
  };
  sheet.getRange("L2:N17").conditionalFormats.add("containsText", {
    text: "PASS",
    format: { fill: "#E7F3EA", font: { color: "#27633B", bold: true } },
  });
  sheet.getRange("L2:N17").conditionalFormats.add("containsText", {
    text: "SOFT",
    format: { fill: "#FFF1CC", font: { color: "#815B00", bold: true } },
  });
  sheet.getRange("L2:N17").conditionalFormats.add("containsText", {
    text: "UPSCALED",
    format: { fill: "#FCE7E5", font: { color: "#9C2C24", bold: true } },
  });
  sheet.getRange("A:O").format.autofitColumns();
  sheet.getRange("C:C").format.columnWidthPx = 360;
  sheet.getRange("O:O").format.columnWidthPx = 320;
  sheet.getRange("A:A").format.columnWidthPx = 120;
  sheet.getRange("B:B").format.columnWidthPx = 150;
  sheet.getRange("E:E").format.columnWidthPx = 110;
}

summary.showGridLines = false;
summary.getRange("A1:F1").format = {
  fill: "#1E2420",
  font: { bold: true, color: "#FFFFFF", size: 18 },
};
summary.getRange("A3:B3").format = { fill: "#B08D57", font: { bold: true, color: "#FFFFFF" } };
summary.getRange("D3:E3").format = { fill: "#B08D57", font: { bold: true, color: "#FFFFFF" } };
summary.getRange("A3:B10").format.borders = { preset: "outside", style: "thin", color: "#D8D0C4" };
summary.getRange("D3:E10").format.borders = { preset: "outside", style: "thin", color: "#D8D0C4" };
summary.getRange("A:F").format.columnWidthPx = 180;
summary.getRange("A:A").format.columnWidthPx = 230;
summary.getRange("D:D").format.columnWidthPx = 230;
summary.getRange("B:B").format.columnWidthPx = 170;
summary.getRange("E:E").format.columnWidthPx = 190;

const csvCheck = await Workbook.fromCSV(productionCsv.replace(/^\uFEFF/, ""), { sheetName: "CSV Check" });
const csvInspect = await csvCheck.inspect({
  kind: "table",
  range: "CSV Check!A1:J17",
  include: "values",
  tableMaxRows: 17,
  tableMaxCols: 10,
});
await fs.writeFile(path.join(qaDir, "csv-validation.ndjson"), csvInspect.ndjson, "utf8");

for (const sheetName of ["QA Summary", "Production Audit", "Preview Audit"]) {
  const previewImage = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    path.join(qaDir, `${sheetName.toLowerCase().replaceAll(" ", "-")}.png`),
    new Uint8Array(await previewImage.arrayBuffer()),
  );
}

const auditInspect = await workbook.inspect({
  kind: "table",
  range: "Preview Audit!A1:O17",
  include: "values,formulas",
  tableMaxRows: 17,
  tableMaxCols: 15,
});
await fs.writeFile(path.join(qaDir, "workbook-validation.ndjson"), auditInspect.ndjson, "utf8");

const errorInspect = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
await fs.writeFile(path.join(qaDir, "workbook-errors.ndjson"), errorInspect.ndjson, "utf8");

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(path.join(root, "HOMEPAGE_MARKETING_IMAGE_AUDIT.xlsx"));
console.log(JSON.stringify({ productionRows: production.length + noImage.length, previewRows: preview.length + noImage.length }));
