/* core.js — 全局基础逻辑（从 app.js 抽出） */

/* 1. 默认日期 = 打开 App 当天的 NZ 日期 */
window.addEventListener("load", () => {
    const dateInput = document.getElementById("date");

    if (dateInput.value) return;

    const nz = new Date();
    nz.setMinutes(nz.getMinutes() - nz.getTimezoneOffset());
    dateInput.value = nz.toISOString().slice(0, 10);
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

/* 4. setLang 外部接口（调用 lang.js 的 setLangInternal） */
function setLang(lang) {
    setLangInternal(lang);
    langMenu.style.opacity = 0;
    setTimeout(() => langMenu.style.display = "none", 200);
}
