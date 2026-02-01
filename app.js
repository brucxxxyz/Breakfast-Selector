/* ============================================================
   app.js — 主逻辑（最终整合版）
   依赖：lang.js / materials.js
============================================================ */


/* ============================================================
   1. 默认日期 = 打开 App 当天的 NZ 日期（只执行一次）
============================================================ */
window.addEventListener("load", () => {
    const dateInput = document.getElementById("date");

    if (dateInput.value) return;

    const nz = new Date();
    nz.setMinutes(nz.getMinutes() - nz.getTimezoneOffset());
    dateInput.value = nz.toISOString().slice(0, 10);
});


/* ============================================================
   2. 暗夜模式按钮
============================================================ */
const darkBtn = document.getElementById("darkBtn");

darkBtn.onclick = () => {
    document.body.classList.toggle("dark");

    darkBtn.style.opacity = 0;
    setTimeout(() => {
        darkBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
        darkBtn.style.opacity = 1;
    }, 150);
};


/* ============================================================
   3. 语言菜单按钮
============================================================ */
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");

langBtn.onclick = () => {
    if (langMenu.style.display === "block") {
        langMenu.style.opacity = 0;
        setTimeout(() => langMenu.style.display = "none", 200);
    } else {
        langMenu.style.display = "block";
        setTimeout(() => langMenu.style.opacity = 1, 10);
    }
};


/* ============================================================
   4. 语言切换
============================================================ */
function setLang(lang) {
    setLangInternal(lang);
    langMenu.style.opacity = 0;
    setTimeout(() => langMenu.style.display = "none", 200);
}


/* ============================================================
   5. UI 文案更新
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

onLangChange((L) => {
    applyLang(L);
    renderRecommendedMaterials();
    renderSelected();
    refreshSmartArea();   // ★ 智能推荐即时翻译
});

applyLang(getLangPack());

/* ============================================================
   6. 模式切换（智能 / 自主）
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
   7. 推荐材料（自主选择模式自动显示）
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
   8. 智能推荐（一次提供 3 组）
============================================================ */
function generate(isUserClick = true) {
    const L = getLangPack();
    const final = document.getElementById("final");

    // 只有用户点击按钮时，才显示“加载中…”和做随机生成
    if (isUserClick) {
        final.textContent = L.smart_loading;

        setTimeout(() => {
            const combos = [];

            for (let i = 0; i < 3; i++) {
                const item = L.smart_items[Math.floor(Math.random() * L.smart_items.length)];
                const kcal = Math.floor(250 + Math.random() * 200);

                combos.push({ text: item, kcal });
            }

            final.innerHTML = combos.map((c, idx) => `
                <div class="card" id="smart_${idx}">
                    <div>${c.text}</div>
                    <div class="nutrition">${L.smart_kcal_prefix}${c.kcal} kcal</div>
                    <button class="secondary" onclick="chooseSmart(${idx})">${L.choose_this}</button>
                </div>
            `).join("");

            window.smartChoices = combos;
        }, 600);
    } else {
        // 语言切换时，只根据已有 smartChoices 重新渲染文字，不重新随机
        if (!window.smartChoices) return;

        final.innerHTML = window.smartChoices.map((c, idx) => `
            <div class="card" id="smart_${idx}">
                <div>${c.text}</div>
                <div class="nutrition">${L.smart_kcal_prefix}${c.kcal} kcal</div>
                <button class="secondary" onclick="chooseSmart(${idx})">${L.choose_this}</button>
            </div>
        `).join("");
    }
}


/* ============================================================
   9. 自主选择材料 + 热量计算
============================================================ */
let selectedMaterials = [];

const searchInput = document.getElementById("materialSearch");
const searchResults = document.getElementById("searchResults");
const selectedBox = document.getElementById("selectedMaterials");

searchInput.oninput = () => {
    const lang = getLang();
    const list = searchMaterials(searchInput.value);
    renderSearchResults(list, lang);
};

function renderSearchResults(list, lang) {
    searchResults.innerHTML = list.map(m => `
        <div class="material-btn" onclick="addMaterial('${m.id}')">
            ${m.emoji} ${m.name[lang]}
        </div>
    `).join("");
}

function addMaterial(id) {
    if (!selectedMaterials.includes(id)) {
        selectedMaterials.push(id);
        renderSelected();
    }
}

function renderSelected() {
    const lang = getLang();
    selectedBox.innerHTML = selectedMaterials.map(id => {
        const m = getMaterialById(id);
        return `
            <div class="selected-item" onclick="removeMaterial('${id}')">
                ${m.emoji} ${m.name[lang]}
            </div>
        `;
    }).join("");
}

function removeMaterial(id) {
    selectedMaterials = selectedMaterials.filter(x => x !== id);
    renderSelected();
}

function generateCustom() {
    const L = getLangPack();
    const lang = getLang();

    if (selectedMaterials.length === 0) {
        document.getElementById("customResult").textContent = L.no_history;
        return;
    }

    let totalKcal = 0;
    const items = selectedMaterials.map(id => {
        const m = getMaterialById(id);
        totalKcal += m.kcal;
        return `${m.emoji} ${m.name[lang]}`;
    }).join(" + ");

    document.getElementById("customResult").innerHTML = `
        <div class="card">
            <div>${items}</div>
            <div class="nutrition">${L.kcal_prefix}${totalKcal} kcal</div>

            <button class="secondary" onclick="saveCustomHistory(${totalKcal})">
                ${L.save_custom}
            </button>

            <button class="danger" onclick="resetCustom()">
                ${L.reset_custom}
            </button>
        </div>
    `;
}

function saveCustomHistory(totalKcal) {
    const L = getLangPack();
    const date = document.getElementById("date").value;

    let history = JSON.parse(localStorage.getItem("breakfastHistory") || "[]");

    if (history.some(h => h.date === date)) {
        alert(L.already_recorded);
        return;
    }

    history.push({
        date,
        items: [...selectedMaterials],
        kcal: totalKcal
    });

    localStorage.setItem("breakfastHistory", JSON.stringify(history));

    alert(L.recorded_tip);
}

function resetCustom() {
    selectedMaterials = [];
    document.getElementById("selectedMaterials").innerHTML = "";
    document.getElementById("customResult").innerHTML = "";
}


/* ============================================================
   10. 历史记录（月份折叠 + 日期倒序 + 即时翻译）
============================================================ */
function showHistory() {
    const L = getLangPack();
    const lang = getLang();
    const box = document.getElementById("historyBox");

    const history = JSON.parse(localStorage.getItem("breakfastHistory") || "[]");

    if (history.length === 0) {
        alert(L.no_history);
        box.innerHTML = "";
        return;
    }

    const groups = {};
    history.forEach(h => {
        const month = h.date.slice(0, 7);
        if (!groups[month]) groups[month] = [];
        groups[month].push(h);
    });

    const sortedMonths = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    box.innerHTML = "";

    sortedMonths.forEach(month => {
        const monthBox = document.createElement("div");
        monthBox.className = "card";

        const monthHeader = document.createElement("div");
        monthHeader.className = "item";
        monthHeader.style.fontWeight = "bold";
        monthHeader.style.cursor = "pointer";

        let monthOpen = false;

        monthHeader.innerHTML = `
            <span class="arrow">▶</span> ${month}
        `;

        const monthDetail = document.createElement("div");
        monthDetail.style.display = "none";
        monthDetail.style.marginTop = "10px";

        const days = groups[month].sort((a, b) => b.date.localeCompare(a.date));

        days.forEach(h => {
            const dayCard = document.createElement("div");
            dayCard.className = "card";
            dayCard.style.margin = "8px 0";

            const header = document.createElement("div");
            header.className = "item";
            header.style.fontWeight = "bold";
            header.style.cursor = "pointer";

            header.innerHTML = `
                <span>${h.date}</span>
                <span style="float:right; opacity:0.7;">${L.kcal_prefix}${h.kcal} kcal</span>
            `;

            const detail = document.createElement("div");
            detail.style.display = "none";
            detail.style.marginTop = "10px";

            let content = "";

            if (h.items && h.items.length > 0) {
                const translated = h.items
                    .map(id => {
                        const m = getMaterialById(id);
                        return `${m.emoji} ${m.name[lang]}`;
                    })
                    .join(" + ");

                content = `${translated}`;
            } else {
                content = `${h.text}`;
            }

            detail.innerHTML = `
                <div>${content}</div>
                <button class="danger" onclick="deleteDay('${h.date}')">${L.delete_day}</button>
            `;

            header.onclick = () => {
                detail.style.display = detail.style.display === "none" ? "block" : "none";
            };

            dayCard.appendChild(header);
            dayCard.appendChild(detail);
            monthDetail.appendChild(dayCard);
        });

        monthHeader.onclick = () => {
            monthOpen = !monthOpen;
            monthDetail.style.display = monthOpen ? "block" : "none";
            monthHeader.querySelector(".arrow").textContent = monthOpen ? "▼" : "▶";
        };

        monthBox.appendChild(monthHeader);
        monthBox.appendChild(monthDetail);
        box.appendChild(monthBox);
    });
}

function deleteDay(date) {
    const L = getLangPack();
    if (!confirm(L.confirm_delete)) return;

    let history = JSON.parse(localStorage.getItem("breakfastHistory") || "[]");
    history = history.filter(h => h.date !== date);
    localStorage.setItem("breakfastHistory", JSON.stringify(history));

    showHistory();
}

function clearHistory() {
    const L = getLangPack();
    if (!confirm(L.confirm_delete)) return;

    localStorage.removeItem("breakfastHistory");
    showHistory();
}

function refreshHistoryTextOnly() {
    const box = document.getElementById("historyBox");

    // 如果历史面板当前是关闭状态，不刷新
    if (box.style.display === "none" || box.innerHTML.trim() === "") return;

    // 否则重新渲染（不会弹出提示）
    showHistory();
}

/* ============================================================
   11. 绑定按钮事件
============================================================ */
document.getElementById("generateBtn").onclick = generate;
document.getElementById("generateCustomBtn").onclick = generateCustom;
document.getElementById("historyBtn").onclick = showHistory;
document.getElementById("clearHistoryBtn").onclick = clearHistory;
