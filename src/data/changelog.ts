export type ChangelogItem = {
  version: string;
  date: string;
  title: Record<string, string>; // locale -> title
  description: Record<string, string>; // locale -> description
};

export const changelogData: ChangelogItem[] = [
  {
    version: "1.9.0",
    date: "2025-12-31",
    title: {
      zh: "2025 KNM 考点更新",
      en: "2025 KNM Syllabus Update",
    },
    description: {
      zh: "根据 2025 年考试重点，补充了大量 KNM 细节知识。涵盖：工作合同 (ZZP/税务)、医疗 (转诊/自付额)、教育 (家长责任/特殊教育)、住房 (急诊/能源)、政治 (选举权/公投) 及社交礼仪等多个板块。",
      en: "Updated KNM content with 2025 exam focus points. Covers detailed additions in Work (ZZP/Tax), Healthcare (Referrals/Deductibles), Education (Parental Liability/Special Ed), Housing (Urgency/Energy), Politics (Voting Rights/Referendums), and Social Etiquette.",
    },
  },
  {
    version: "1.8.0",
    date: "2025-12-25",
    title: {
      zh: "闪卡词包功能上线",
      en: "Flashcard Pack Feature Released",
    },
    description: {
      zh: "新增了闪卡词包功能，可以无限刷词，支持乱序/顺序背词模式，复习模式 (随机抽题)，自动同步生词与学习进度。",
      en: "Added flashcard pack feature, allowing unlimited word practice with shuffle/sequential modes, review mode (random questions), and automatic sync of learned words.",
    },
  },
  {
    version: "1.7.0",
    date: "2025-12-19",
    title: {
      zh: "云端同步与闪卡升级",
      en: "Cloud Sync & Flashcards Update",
    },
    description: {
      zh: "✨ 重磅更新：支持登录账号，实现多端进度自动同步（KNM 阅读历史 + 词汇表 + 闪卡进度）。\n🔒 安全升级：引入 Turnstile 人机验证，加强账号与心愿单安全性。\n🃏 闪卡优化：免费版新增「每日随机」算法，每天 20 个新词不重样。",
      en: "✨ Major Update: User login is now supported with auto-sync across devices (Read history, Vocabulary & Flashcards progress).\n🔒 Security: Implemented Turnstile captcha for enhanced account & waitlist security.\n🃏 Flashcards: Added 'Daily Random' algorithm for free users, ensuring 20 fresh words every day.",
    },
  },
  {
    version: "1.6.0",
    date: "2025-12-16",
    title: {
      zh: "KNM 核心词汇与卡片升级",
      en: "KNM Vocabulary & Card UI Update",
    },
    description: {
      zh: "新增了 60+ KNM 核心词汇（覆盖历史、政治、医疗等），并优化了词汇卡片结构，支持显示词性、例句和分类。",
      en: "Added 60+ essential KNM vocabulary words (covering history, politics, health, etc.) and updated the vocabulary card structure to show part of speech, examples, and categories.",
    },
  },
  {
    version: "1.5.0",
    date: "2025-12-15",
    title: {
      zh: "KNM 进度追踪与体验优化",
      en: "KNM Progress Tracking & UX Improvements",
    },
    description: {
      zh: "新增了阅读进度记忆功能，现在 KNM 文章和词汇表会自动记住你的阅读位置。我们在文章卡片上添加了“已读”标记，方便你快速区分已学内容。",
      en: "Added reading progress memory. KNM articles and vocabulary lists now automatically remember your last position. We also added a 'Read' badge to article cards to help you track your learning.",
    },
  },
  {
    version: "1.4.0",
    date: "2025-12-13",
    title: {
      zh: "添加A2写作速成指南",
      en: "Added A2 Writing Crash Course",
    },
    description: {
      zh: "添加了 A2 写作速成指南，包含写作三大黄金法则。",
      en: "Added A2 writing crash course containing the 3 golden rules.",
    },
  },
  {
    version: "1.3.0",
    date: "2025-12-13",
    title: {
      zh: "添加A2口语速成指南",
      en: "Added A2 Speaking Crash Course",
    },
    description: {
      zh: "添加了 A2 口语速成指南，包含口语三大黄金法则。",
      en: "Added A2 speaking crash course containing the 3 go-to phrases.",
    },
  },
  {
    version: "1.2.0",
    date: "2025-12-03",
    title: {
      zh: "添加A2单词表",
      en: "Added A2 Vocabulary List",
    },
    description: {
      zh: "添加了 A2 单词表，包含 500 个常用单词。",
      en: "Added A2 vocabulary list containing 500 common words.",
    },
  },
  {
    version: "1.1.0",
    date: "2025-11-29",
    title: {
      zh: "AI 助教 (Beta) 上线",
      en: "AI Assistant (Beta) Launched",
    },
    description: {
      zh: "集成了 Google NotebookLM，现在的 AI 助教可以根据当前浏览的页面内容回答问题，并支持生成模拟考题。",
      en: "Integrated with Google NotebookLM. The AI Assistant can now answer questions based on the page content and generate mock exam questions.",
    },
  },
  {
    version: "1.0.0",
    date: "2025-11-28",
    title: {
      zh: "Open KNM 正式发布",
      en: "Open KNM Official Launch",
    },
    description: {
      zh: "第一版正式上线，包含完整的 KNM 核心考点双语文章和基础词汇表。支持中英双语切换。",
      en: "First official release containing comprehensive bilingual KNM core topic articles and basic vocabulary lists. Supports English/Chinese switching.",
    },
  },
];

