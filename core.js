/* ============================================================
   core.js — 全局基础逻辑（最终版）
============================================================ */

/* ============================================================
   1. 默认日期（NZ 时区）
============================================================ */
window.addEventListener("load", () => {
    const dateInput = document.getElementById("date");

    // 如果用户已经手动选择过日期，不覆盖
    if (dateInput.value) return;

    // NZ 时区日期
    const nz = new Date();
    nz.setMinutes(nz.getMinutes() - nz.getTimezoneOffset());
    dateInput.value = nz.toISOString().slice(0, 10);
});

/* ============================================================
   2. 暗夜模式按钮（带淡入动画）
============================================================ */
const darkBtn = document.getElementById("darkBtn");

darkBtn.onclick = () => {
    document.body.classList.toggle("dark");

    // 按钮淡出 → 切换图标 → 淡入
    darkBtn.style.opacity = 0;
    setTimeout(() => {
        darkBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
        darkBtn.style.opacity = 1;
    }, 150);
};

/* ============================================================
   3. 语言菜单按钮（带淡入淡出）
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
   4. setLang 外部接口（调用 lang.js 的 setLangInternal）
============================================================ */
function setLang(lang) {
    setLangInternal(lang);

    // 关闭语言菜单
    langMenu.style.opacity = 0;
    setTimeout(() => langMenu.style.display = "none", 200);
}
