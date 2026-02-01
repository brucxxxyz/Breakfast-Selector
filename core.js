/* ============================================================
   core.js — 全局基础逻辑（最终版）
============================================================ */

/* 1. 默认日期（NZ 时区） */
window.addEventListener("load", () => {
    const dateInput = document.getElementById("date");
    if (!dateInput.value) {
        const nz = new Date();
        nz.setMinutes(nz.getMinutes() - nz.getTimezoneOffset());
        dateInput.value = nz.toISOString().slice(0, 10);
    }
});

/* 2. 暗夜模式按钮 */
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
   3. 语言菜单按钮（升级版：支持点击外部关闭）
============================================================ */
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");

langBtn.onclick = (e) => {
    e.stopPropagation(); // ★ 防止触发外部点击关闭

    if (langMenu.style.display === "block") {
        closeLangMenu();
    } else {
        openLangMenu();
    }
};

function openLangMenu() {
    langMenu.style.display = "block";
    setTimeout(() => langMenu.style.opacity = 1, 10);
}

function closeLangMenu() {
    langMenu.style.opacity = 0;
    setTimeout(() => langMenu.style.display = "none", 200);
}

/* ============================================================
   4. setLang 外部接口（保存语言 + 切换语言 + 自动收起）
============================================================ */
function setLang(lang) {
    localStorage.setItem("appLang", lang);   // ★ 保存语言
    setLangInternal(lang);                   // ★ 切换语言
    closeLangMenu();                         // ★ 选择语言后自动收起
}

/* ============================================================
   5. 页面加载时恢复语言
============================================================ */
window.addEventListener("load", () => {
    const saved = localStorage.getItem("appLang");
    if (saved) {
        setLangInternal(saved);   // ★ 不打开菜单
    }
});

/* ============================================================
   6. 点击页面其他地方时关闭语言菜单（最终版）
============================================================ */
document.addEventListener("click", (e) => {
    // 菜单没打开 → 不处理
    if (langMenu.style.display !== "block") return;

    // 点击语言按钮 → 不关闭（已在按钮逻辑处理）
    if (langBtn.contains(e.target)) return;

    // 点击菜单内部（语言选项） → 不关闭（setLang 会关闭）
    if (langMenu.contains(e.target)) return;

    // 其他任何地方 → 关闭
    closeLangMenu();
});
