/* ============================================================
   materials.js — 多语言材料库（最终版）
============================================================ */

const MATERIALS = [
    {
        id: "egg",
        name: {
            "zh-CN": "鸡蛋",
            "zh-HK": "雞蛋",
            "en": "Egg"
        },
        emoji: "🥚",
        kcal: 78,
        tags: ["protein", "basic"]
    },
    {
        id: "toast",
        name: {
            "zh-CN": "吐司",
            "zh-HK": "多士",
            "en": "Toast"
        },
        emoji: "🍞",
        kcal: 80,
        tags: ["carb", "bread"]
    },
    {
        id: "milk",
        name: {
            "zh-CN": "牛奶",
            "zh-HK": "牛奶",
            "en": "Milk"
        },
        emoji: "🥛",
        kcal: 90,
        tags: ["drink", "protein"]
    },
    {
        id: "oatmeal",
        name: {
            "zh-CN": "燕麦",
            "zh-HK": "燕麥",
            "en": "Oatmeal"
        },
        emoji: "🥣",
        kcal: 150,
        tags: ["carb", "healthy"]
    },
    {
        id: "fruit",
        name: {
            "zh-CN": "水果",
            "zh-HK": "生果",
            "en": "Fruit"
        },
        emoji: "🍎",
        kcal: 60,
        tags: ["vitamin", "fresh"]
    },
    {
        id: "yogurt",
        name: {
            "zh-CN": "酸奶",
            "zh-HK": "乳酪",
            "en": "Yogurt"
        },
        emoji: "🥛",
        kcal: 100,
        tags: ["protein", "fresh"]
    },
    {
        id: "congee",
        name: {
            "zh-CN": "粥",
            "zh-HK": "粥",
            "en": "Congee"
        },
        emoji: "🍚",
        kcal: 120,
        tags: ["carb", "warm"]
    },
    {
        id: "sandwich",
        name: {
            "zh-CN": "三明治",
            "zh-HK": "三文治",
            "en": "Sandwich"
        },
        emoji: "🥪",
        kcal: 250,
        tags: ["mix", "western"]
    },
    {
        id: "coffee",
        name: {
            "zh-CN": "咖啡",
            "zh-HK": "咖啡",
            "en": "Coffee"
        },
        emoji: "☕",
        kcal: 5,
        tags: ["drink", "caffeine"]
    },
    {
        id: "ham",
        name: {
            "zh-CN": "火腿",
            "zh-HK": "火腿",
            "en": "Ham"
        },
        emoji: "🥓",
        kcal: 120,
        tags: ["protein", "processed"]
    },
    {
        id: "juice",
        name: {
            "zh-CN": "果汁",
            "zh-HK": "果汁",
            "en": "Juice"
        },
        emoji: "🧃",
        kcal: 90,
        tags: ["drink", "sweet"]
    }
];

/* ============================================================
   搜索材料（支持多语言）
============================================================ */
function searchMaterials(keyword) {
    const lang = getLang();
    if (!keyword) return MATERIALS;

    const kw = keyword.trim().toLowerCase();

    return MATERIALS.filter(m =>
        m.name[lang].toLowerCase().includes(kw) ||
        m.tags.some(t => t.toLowerCase().includes(kw))
    );
}

/* ============================================================
   根据 id 获取材料
============================================================ */
function getMaterialById(id) {
    return MATERIALS.find(m => m.id === id) || null;
}
