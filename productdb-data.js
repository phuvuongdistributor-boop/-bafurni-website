window.BA_PRODUCTDB_META={"source":"ProductDB_V2 products.json","sourceTotal":3301,"bundledCount":300,"generatedAt":"2026-07-10","mode":"static-readonly-bundle-phase1","selection":"quality-first-priority-categories"};
window.BA_PRODUCTDB_COLUMNS=["Code","ProductName","Category","SubCategory","Image_URL","SalePrice","Size","Material","Description","Source_Group","Source_URL"];
window.BA_PRODUCT_ROWS=[];
window.BA_PRODUCTDB_EXPAND=function(value){return String(value||'').replace('@HP/','https://noithathoaphat.com/').replace('@TO/','https://theone.vn/').replace('@T1/','https://noithattheonevietnam.vn/');};
window.BAAddProductRows=function(rows){rows.forEach(function(row){var item={};window.BA_PRODUCTDB_COLUMNS.forEach(function(key,index){item[key]=key==='Image_URL'||key==='Source_URL'?window.BA_PRODUCTDB_EXPAND(row[index]):row[index];});window.BA_PRODUCT_ROWS.push(item);});};
