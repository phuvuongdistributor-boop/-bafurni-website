(function(){
  if(window.BACategoryVisualLibrary)return;
  const mainBase="/images/categories/main/";
  const subBase="/images/categories/sub/";
  const placeholder="/images/categories/placeholders/category-placeholder.svg";
  const main={
    OFFICE_CHAIR:{image:mainBase+"office-chair.svg",alt:"Ghế văn phòng BA_Furniture"},
    OFFICE_DESK:{image:mainBase+"office-desk.svg",alt:"Bàn văn phòng BA_Furniture"},
    MEETING_TABLE:{image:mainBase+"meeting-table.svg",alt:"Bàn họp BA_Furniture"},
    CABINET_STORAGE:{image:mainBase+"cabinet-storage.svg",alt:"Tủ và hộc tài liệu BA_Furniture"},
    LOCKER_STEEL:{image:mainBase+"locker-steel.svg",alt:"Tủ sắt và locker BA_Furniture"},
    SOFA_WAITING:{image:mainBase+"sofa-waiting.svg",alt:"Sofa và ghế chờ BA_Furniture"},
    SCHOOL_FURNITURE:{image:mainBase+"school-furniture.svg",alt:"Nội thất trường học BA_Furniture"},
    SHELVING_RACK:{image:mainBase+"shelving-rack.svg",alt:"Kệ và giá kho BA_Furniture"},
    PUBLIC_PROJECT:{image:mainBase+"public-project.svg",alt:"Nội thất công cộng và công trình BA_Furniture"},
    MEDICAL_FURNITURE:{image:mainBase+"medical-furniture.svg",alt:"Nội thất y tế BA_Furniture"},
    HOME_UTILITY:{image:mainBase+"home-utility.svg",alt:"Nội thất gia đình và gia dụng BA_Furniture"},
    PARTITION_ACCESSORY:{image:mainBase+"partition-accessory.svg",alt:"Vách và phụ kiện BA_Furniture"}
  };
  const sub={
    EXECUTIVE_CHAIR:subBase+"executive-chair.svg",MESH_CHAIR:subBase+"mesh-chair.svg",VISITOR_CHAIR:subBase+"visitor-chair.svg",TRAINING_CHAIR:subBase+"training-chair.svg",EXECUTIVE_DESK:subBase+"executive-desk.svg",STEEL_CABINET:subBase+"steel-cabinet.svg",STEEL_LOCKER:subBase+"locker.svg",OFFICE_SOFA:subBase+"sofa.svg",STUDENT_DESK:subBase+"school-desk.svg",STEEL_SHELVING:subBase+"shelving.svg",SMALL_MEETING_TABLE:subBase+"meeting-table.svg",CANTEEN_FURNITURE:subBase+"canteen.svg"
  };
  function esc(value){return String(value||"").replace(/[&<>\"]/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch];});}
  function abs(path){return new URL(path,window.location.origin).href;}
  function patchLibrary(){
    const library=Array.isArray(window.BA_CATEGORY_LIBRARY)?window.BA_CATEGORY_LIBRARY:[];
    library.forEach(function(category){
      const visual=main[category.id];
      if(visual){category.image=visual.image;category.imageAlt=visual.alt;}
      (category.subcategories||[]).forEach(function(item){if(sub[item[0]])item[3]=sub[item[0]];});
    });
  }
  function img(src,alt){return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" width="800" height="600" />`;}
  function patchMainCards(){
    document.querySelectorAll("[data-main-category]").forEach(function(card){
      const id=card.getAttribute("data-main-category");
      const visual=main[id];
      const media=card.querySelector(".category-group-card__media");
      if(!media||!visual)return;
      media.classList.remove("category-group-card__placeholder","category-group-card__placeholder--tone-1","category-group-card__placeholder--tone-2","category-group-card__placeholder--tone-3","category-group-card__placeholder--tone-4");
      media.classList.add("category-visual-media");
      media.setAttribute("aria-label",visual.alt);
      media.innerHTML=img(visual.image,visual.alt);
    });
  }
  function patchSubCards(){
    document.querySelectorAll(".category-subgroup-card[data-subcategory]").forEach(function(card){
      if(card.querySelector(".category-subgroup-card__visual"))return;
      const id=card.getAttribute("data-subcategory");
      const src=sub[id]||placeholder;
      const label=(card.textContent||"Nhóm sản phẩm BA_Furniture").trim();
      const visual=document.createElement("span");
      visual.className="category-subgroup-card__visual";
      visual.setAttribute("aria-hidden","true");
      visual.innerHTML=img(src,label);
      card.insertBefore(visual,card.firstChild);
    });
  }
  function patchCategoryHero(){
    const hero=document.querySelector(".category-template-hero__visual");
    if(!hero)return;
    const route=window.BARouting&&window.BARouting.parseCategoryRoute?window.BARouting.parseCategoryRoute():{categorySlug:"ghe-van-phong"};
    const library=Array.isArray(window.BA_CATEGORY_LIBRARY)?window.BA_CATEGORY_LIBRARY:[];
    const slugify=window.BARouting&&window.BARouting.slugify?window.BARouting.slugify:function(value){return String(value||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");};
    const category=library.find(function(item){return slugify(item.name)===route.categorySlug;})||library[0];
    const visual=main[category&&category.id]||main.OFFICE_CHAIR;
    hero.classList.add("has-category-image");
    if(!hero.querySelector("img"))hero.insertAdjacentHTML("afterbegin",img(visual.image,visual.alt));
  }
  function run(){patchLibrary();patchMainCards();patchSubCards();patchCategoryHero();document.documentElement.dataset.categoryVisualLibrary="ready:"+Object.keys(main).length;}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});else run();
  const observer=new MutationObserver(function(){window.requestAnimationFrame(run);});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.BACategoryVisualLibrary={main,sub,run,version:"2026-07-10-s23"};
})();
