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

/* 3. 语言菜单按钮 */
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

/* 4. setLang 外部接口（保存语言 + 切换语言） */
function setLang(lang) {
    localStorage.setItem("appLang", lang);   // ★ 保存语言
    setLangInternal(lang);

    langMenu.style.opacity = 0;
    setTimeout(() => langMenu.style.display = "none", 200);
}

/* 5. 页面加载时恢复语言 */
window.addEventListener("load", () => {
    const saved = localStorage.getItem("appLang");
    if (saved) {
        setLangInternal(saved);   // ★ 不打开菜单
    }
});
