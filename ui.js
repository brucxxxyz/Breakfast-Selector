/* ============================================================
   ui.js — UI 文案更新 + 模式切换 + 推荐材料（最终版）
============================================================ */

/* ============================================================
   1. UI 文案更新（语言切换时调用）
============================================================ */
function applyLang(L) {
    document.getElementById("title").textContent = L.title;
    document.getElementById("subtitle").textContent = L.subtitle;

    document.getElementById("label-name").textContent = L.name;
    document.getElementById("label-date").textContent = L.date;
    document.getElementById("label-mode").textContent = L.mode;

    document.querySelector("#modeSelect option[value='smart']").textContent = L.mode_smart;
    document.querySelector("#modeSelect option[value='custom']").textContent = L.mode_custom;

    document.getElementById("label-search").textContent = L.search;
    document.getElementById("selected-title").textContent = L.selected;
    document.getElementById("custom-title").textContent = L.custom_title;

    document.getElementById("generateBtn").textContent = L.generate;
    document.getElementById("generateCustomBtn").textContent = L.generate_custom;
    document.getElementById("historyBtn").textContent = L.history;
    document.getElementById("clearHistoryBtn").textContent = L.clear_history;

    document.getElementById("name").placeholder = L.placeholder_name;
    document.getElementById("materialSearch").placeholder = L.placeholder_search;
}

/* ============================================================
   2. 模式切换（智能推荐 / 自主选择）
============================================================ */
const modeSelect = document.getElementById("modeSelect");
const smartArea = document.getElementById("smartArea");
const customArea = document.getElementById("customArea");

modeSelect.onchange = () => {
    if (modeSelect.value === "smart") {
        smartArea.style.display = "block";
        customArea.style.display = "none";
    } else {
        smartArea.style.display = "none";
        customArea.style.display = "block";
        renderRecommendedMaterials();
    }
};

/* ============================================================
   3. 推荐材料（自主选择模式）
============================================================ */
const RECOMMENDED_MATERIALS = [
    "egg", "toast", "milk",
    "oatmeal", "fruit", "yogurt",
    "coffee", "ham", "juice"
];

function renderRecommendedMaterials() {
    const lang = getLang();
    const list = RECOMMENDED_MATERIALS
        .map(id => getMaterialById(id))
        .filter(m => m);

    document.getElementById("searchResults").innerHTML = list.map(m => `
        <div class="material-btn" onclick="addMaterial('${m.id}')">
            ${m.emoji} ${m.name[lang]}
        </div>
    `).join("");
}

/* ============================================================
   4. 语言切换时刷新 UI（与 features.js 完美配套）
============================================================ */
onLangChange((L) => {
    applyLang(L);              // 更新所有 UI 文案
    renderRecommendedMaterials(); // 更新推荐材料
    renderSelected();          // 更新自主选择材料
    refreshSmartArea();
    showHistory();         // ★ 结构化智能推荐即时翻译
});
