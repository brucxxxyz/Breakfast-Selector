/* ============================================================
   lang.js
   多语言包：简体中文 / 繁體中文 / English
============================================================ */

const LANG_PACK = {
    "zh-CN": {
        title: "🍳 今日早餐推荐",
        subtitle: "为你生成简单、均衡的早餐组合",

        name: "大名",
        date: "日期",
        mode: "生成方式",

        mode_custom: "自主选择材料",
        mode_smart: "智能生成",

        search: "搜索材料",
        selected: "已选择材料",
        custom_title: "选择你今天想吃的材料",
        generate_custom: "根据材料生成早餐",

        generate: "推荐早餐",
        history: "查看历史",
        clear_history: "清除历史",

        no_history: "暂无历史记录",
        delete_day: "删除当天记录",
        confirm_delete: "确定删除这一天的记录吗？",

        smart_loading: "正在为你准备早餐…",
        smart_result_prefix: "你的早餐是：",

        /* ★ 统一卡路里前缀为 🔥 */
        smart_kcal_prefix: "🔥 ",
        kcal_prefix: "🔥 ",

        /* ★ 翻译提示 */
        already_recorded: "今天已经有记录了！",
        recorded_tip: "已记录！",

        smart_items: [
            "🥚 鸡蛋 + 🍞 吐司 + 🥛 牛奶",
            "🥣 燕麦 + 🍎 水果 + 🥛 酸奶",
            "🍚 粥 + 🥚 鸡蛋 + 🥤 豆浆",
            "🥪 三明治 + ☕ 咖啡",
            "🍞 面包 + 🥓 火腿 + 🧃 果汁"
        ],

        choose_this: "选择这个",

        placeholder_name: "请输入你的名字",
        placeholder_search: "搜索材料",

        save_custom: "记录到历史记录",
        reset_custom: "重新选择",
        saved_tip: "已保存到历史记录！"
    },

    "zh-HK": {
        title: "🍳 今日早餐推薦",
        subtitle: "為你生成簡單、均衡的早餐組合",

        name: "大名",
        date: "日期",
        mode: "生成方式",

        mode_custom: "自主選擇材料",
        mode_smart: "智能生成",

        search: "搜尋材料",
        selected: "已選材料",
        custom_title: "選擇你今日想食嘅材料",
        generate_custom: "根據材料生成早餐",

        generate: "推薦早餐",
        history: "查看歷史",
        clear_history: "清除歷史",

        no_history: "暫無歷史記錄",
        delete_day: "刪除當天記錄",
        confirm_delete: "確定刪除呢一日嘅記錄嗎？",

        smart_loading: "為你準備早餐中…",
        smart_result_prefix: "你嘅早餐係：",

        /* ★ 统一卡路里前缀为 🔥 */
        smart_kcal_prefix: "🔥 ",
        kcal_prefix: "🔥 ",

        /* ★ 翻译提示 */
        already_recorded: "今日已經有記錄！",
        recorded_tip: "已記錄！",

        smart_items: [
            "🥚 雞蛋 + 🍞 多士 + 🥛 牛奶",
            "🥣 燕麥 + 🍎 生果 + 🥛 乳酪",
            "🍚 粥 + 🥚 雞蛋 + 🥤 豆漿",
            "🥪 三文治 + ☕ 咖啡",
            "🍞 麵包 + 🥓 火腿 + 🧃 果汁"
        ],

        choose_this: "揀呢個",

        placeholder_name: "請輸入你的名字",
        placeholder_search: "搜尋材料",

        save_custom: "記錄到歷史記錄",
        reset_custom: "重新選擇",
        saved_tip: "已保存到歷史記錄！"
    },

    "en": {
        title: "🍳 Today's Breakfast",
        subtitle: "Simple and balanced breakfast suggestions",

        name: "Name",
        date: "Date",
        mode: "Generation Mode",

        mode_custom: "Custom Ingredients",
        mode_smart: "Smart Suggestions",

        search: "Search Ingredients",
        selected: "Selected Ingredients",
        custom_title: "Choose what you want to eat today",
        generate_custom: "Generate Breakfast",

        generate: "Recommend Breakfast",
        history: "View History",
        clear_history: "Clear History",

        no_history: "No history yet",
        delete_day: "Delete This Day",
        confirm_delete: "Delete this day's record?",

        smart_loading: "Preparing your breakfast…",
        smart_result_prefix: "Your breakfast is:",

        /* ★ 统一卡路里前缀为 🔥 */
        smart_kcal_prefix: "🔥 ",
        kcal_prefix: "🔥 ",

        /* ★ 翻译提示 */
        already_recorded: "You already have a record today!",
        recorded_tip: "Saved!",

        smart_items: [
            "🥚 Egg + 🍞 Toast + 🥛 Milk",
            "🥣 Oatmeal + 🍎 Fruit + 🥛 Yogurt",
            "🍚 Porridge + 🥚 Egg + 🥤 Soy Milk",
            "🥪 Sandwich + ☕ Coffee",
            "🍞 Bread + 🥓 Ham + 🧃 Juice"
        ],

        choose_this: "Choose this",

        placeholder_name: "Enter your name",
        placeholder_search: "Search ingredients",

        save_custom: "Save to History",
        reset_custom: "Reset Selection",
        saved_tip: "Saved to history!"
    }
};


/* ============================================================
   当前语言状态
============================================================ */

let CURRENT_LANG = "zh-CN";
let langChangeCallbacks = [];


/* ============================================================
   API：供 app.js 调用
============================================================ */

function getLang() {
    return CURRENT_LANG;
}

function getLangPack() {
    return LANG_PACK[CURRENT_LANG];
}

function setLangInternal(lang) {
    if (!LANG_PACK[lang]) return;
    CURRENT_LANG = lang;
    localStorage.setItem("lang", lang);

    const pack = LANG_PACK[lang];
    langChangeCallbacks.forEach(fn => fn(pack, lang));
}

function onLangChange(callback) {
    if (typeof callback === "function") {
        langChangeCallbacks.push(callback);
    }
}


/* ============================================================
   初始化：恢复上次语言
============================================================ */

(function initLang() {
    const saved = localStorage.getItem("lang");
    if (saved && LANG_PACK[saved]) {
        CURRENT_LANG = saved;
    }
})();
