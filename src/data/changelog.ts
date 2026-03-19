export type ChangelogItem = {
  version: string;
  date: string;
  title: Record<string, string>; // locale -> title
  description: Record<string, string>; // locale -> description
};

export const changelogData: ChangelogItem[] = [
  {
    version: "2.1.1",
    date: "2026-03-19",
    title: {
      zh: "词汇表优化：B1 词汇界面简化",
      en: "Vocabulary List Update: Simplified B1 Interface",
    },
    description: {
      zh: "🎨 界面优化：B1 词汇表不再显示种类筛选器，因为 B1 词汇暂无分类，提供更简洁的浏览体验。",
      en: "🎨 UI Improvement: B1 vocabulary no longer shows category filter since B1 words don't have categories yet, providing a cleaner browsing experience.",
    },
  },
  {
    version: "2.1.0",
    date: "2026-03-18",
    title: {
      zh: "新增 B1 词汇表：免费开放 870+ 个进阶词汇",
      en: "Added B1 Vocabulary: 870+ Advanced Words Now Free",
    },
    description: {
      zh: "📚 B1 词汇免费开放：新增 870+ 个 B1 级别词汇，涵盖工作、住房、健康、行政等主题，完全免费向所有用户开放。\n🎯 完整覆盖：从 A2 基础到 B1 进阶，总计 1300+ 个核心词汇，助力荷兰语能力全面提升。\n📖 来源权威：词汇来源于官方 B1 教材 Contact nieuw 3，确保内容准确可靠。",
      en: "📚 B1 Vocabulary Now Free: Added 870+ B1-level words covering work, housing, health, admin topics, all completely free for all users.\n🎯 Complete Coverage: From A2 foundation to B1 advanced, 1300+ core vocabulary words for comprehensive Dutch language improvement.\n📖 Authoritative Source: Vocabulary from official B1 textbook Contact nieuw 3, ensuring accurate and reliable content.",
    },
  },
  {
    version: "2.0.0",
    date: "2026-02-07",
    title: {
      zh: "口语练习全面升级：真实考试格式 + 学习资源",
      en: "Speaking Practice Major Update: Real Exam Format + Learning Resources",
    },
    description: {
      zh: "🎯 真实考试格式：问答题现在采用真实考试格式，先播放情景陈述（Context），然后提出双重问题（必须回答两个部分）。\n📚 学习资源：添加了 YouTube 推荐视频系列，帮助用户更好地准备口语考试。\n🎧 听力练习模式：新增「隐藏题目文本」选项，模拟真实考试中只能听题、不能看题的情况。\n⚡ 播放速度控制：为问题播放添加了独立的速度控制（0.5x/0.75x/1.0x），方便不同水平的用户练习。\n📝 题目优化：更新了所有问答题，涵盖日常生活、业余爱好、交通出行、社交邻里等真实场景。",
      en: "🎯 Real Exam Format: Q&A questions now follow the real exam format with context statements followed by two-part questions.\n📚 Learning Resources: Added recommended YouTube video series to help users prepare for the speaking exam.\n🎧 Listening Practice Mode: Added 'Hide question text' option to simulate real exam conditions where you can only listen, not read.\n⚡ Playback Speed Control: Added independent speed control (0.5x/0.75x/1.0x) for question playback to accommodate different skill levels.\n📝 Question Updates: Updated all Q&A questions covering real-life scenarios: daily life, hobbies, transportation, and social interactions.",
    },
  },
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

