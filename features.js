/* ============================================================
   features.js — 智能推荐 + 自主选择 + 历史记录（结构化 + 完整翻译版）
============================================================ */

/* ============================================================
   工具函数：从智能推荐文本中提取材料 ID（结构化）
============================================================ */
function extractMaterialIds(text, lang) {
    const ids = [];

    MATERIALS.forEach(m => {
        if (text.includes(m.name[lang]) || text.includes(m.emoji)) {
            ids.push(m.id);
        }
    });

    return ids;
}

/* ============================================================
   8. 智能推荐（结构化 + 即时翻译）
============================================================ */
function generate(isUserClick = true) {
    const L = getLangPack();
    const lang = getLang();
    const final = document.getElementById("final");

    if (isUserClick) {
        final.textContent = L.smart_loading;

        setTimeout(() => {
            const combos = [];

            for (let i = 0; i < 3; i++) {
                const itemText = L.smart_items[Math.floor(Math.random() * L.smart_items.length)];
                const kcal = Math.floor(250 + Math.random() * 200);

                // ★ 结构化提取材料 ID
                const items = extractMaterialIds(itemText, lang);

                combos.push({
                    text: itemText,
                    kcal,
                    items   // ★ 新增结构化字段
                });
            }

            window.smartChoices = combos;
            refreshSmartArea(); // ★ 用结构化翻译渲染
        }, 600);
    } else {
        refreshSmartArea();
    }
}

/* ============================================================
   智能推荐：选择某一项
============================================================ */
function chooseSmart(index) {
    const L = getLangPack();
    const chosen = smartChoices[index];
    const date = document.getElementById("date").value;

    let history = JSON.parse(localStorage.getItem("breakfastHistory") || "[]");

    if (history.some(h => h.date === date)) {
        alert(L.already_recorded);
        return;
    }

    history.push({
        date,
        items: chosen.items,   // ★ 保存结构化材料
        text: chosen.text,     // 兼容旧数据
        kcal: chosen.kcal
    });

    localStorage.setItem("breakfastHistory", JSON.stringify(history));

    for (let i = 0; i < 3; i++) {
        if (i !== index) {
            document.getElementById(`smart_${i}`).style.display = "none";
        }
    }

    alert(L.recorded_tip);
}

/* ============================================================
   智能推荐：即时翻译（结构化）
============================================================ */
function refreshSmartArea() {
    const final = document.getElementById("final");
    const L = getLangPack();
    const lang = getLang();

    if (!window.smartChoices) return;

    // ★ 根据 items 重建 text（真正的结构化翻译）
    window.smartChoices = window.smartChoices.map(c => {
        const translatedText = c.items
            .map(id => {
                const m = getMaterialById(id);
                return `${m.emoji} ${m.name[lang]}`;
            })
            .join(" + ");

        return {
            ...c,
            text: translatedText
        };
    });

    final.innerHTML = window.smartChoices.map((c, idx) => `
        <div class="card" id="smart_${idx}">
            <div>${c.text}</div>
            <div class="nutrition">${L.smart_kcal_prefix}${c.kcal} kcal</div>
            <button class="secondary" onclick="chooseSmart(${idx})">${L.choose_this}</button>
        </div>
    `).join("");
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
        items: [...selectedMaterials], // ★ 结构化保存
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
   10. 历史记录（结构化 + 完整翻译）
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
                // ★ 结构化翻译（智能推荐 + 自主选择都支持）
                const translated = h.items
                    .map(id => {
                        const m = getMaterialById(id);
                        return `${m.emoji} ${m.name[lang]}`;
                    })
                    .join(" + ");

                content = translated;
            } else {
                // ★ 兼容旧数据
                content = h.text;
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

/* ============================================================
   11. 绑定按钮事件
============================================================ */
document.getElementById("generateBtn").onclick = generate;
document.getElementById("generateCustomBtn").onclick = generateCustom;
document.getElementById("historyBtn").onclick = showHistory;
document.getElementById("clearHistoryBtn").onclick = clearHistory;
