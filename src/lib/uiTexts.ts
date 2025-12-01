export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export type NavTexts = {
  society: string;
  life: string;
  knm: string;
  resources: string;
  assistant: string;
  vocabulary: string;
  about: string;
};

export type VocabularyTexts = {
  title: string;
  description: string;
  promoTitle: string;
  promoDesc: string;
  loadMore: string;
  showing: string;
  of: string;
  categories: {
    all: string;
    daily: string;
    work: string;
    housing: string;
    health: string;
    admin: string;
  };
};

export type UiTexts = {
  nav: NavTexts;
  footer: {
    tagline: string;
    note: string;
    discord: string;
  };
  assistant: {
    aiAssistantTitle: string;
    aiAssistantDesc: string;
    openNotebook: string;
    badgeLabel: string;
    detailLine1: string;
    detailLine2: string;
    detailLine3: string;
    highlightLine: string;
    bannerTitle: string;
    bannerSubtitle: string;
    promoTitle: string;
    promoDesc: string;
    promoAction: string;
  };
  vocabulary: VocabularyTexts;
  disclaimer: {
    title: string;
    text: string;
  };
  articleNav: {
    prev: string;
    next: string;
    home: string;
  };
};

export const uiTexts: Record<Locale, UiTexts> = {
  zh: {
    nav: {
      society: "荷兰社会",
      life: "生活实用",
      knm: "KNM 专区",
      resources: "资源",
      assistant: "AI 助教",
      vocabulary: "高频词汇",
      about: "关于与贡献",
    },
    footer: {
      tagline: "© open-knm，欢迎开源共享。",
      note: "为准备在荷兰生活、学习与工作的你而写。",
      discord: "加入 Discord 社区讨论",
    },
    assistant: {
      aiAssistantTitle: "AI 助教 · NotebookLM",
      aiAssistantDesc:
        "我们把 open-knm 的内容上传到 NotebookLM，打开后就能问问题、让 AI 帮你总结和记忆，像在和真人学伴一起复习。",
      openNotebook: "立即体验 AI 助教",
      badgeLabel: "AI 助教",
      detailLine1: "NotebookLM 会读你正在浏览的 open-knm 内容，AI 直接回答笔记、考点、记忆法。",
      detailLine2: "一键打开后就能问问题，让 AI 帮你总结、出题或解释重点知识。",
      detailLine3: "内容源自开源贡献并经审核，确保回答准确可靠。",
      highlightLine: "把这个页面分享给小组，大家都能看到 AI 助教的卡点建议。",
      bannerTitle: "AI 助教已上线",
      bannerSubtitle: "立即点击按钮让 NotebookLM 还原你的复习私教。",
      promoTitle: "全新：AI 助教上线",
      promoDesc: "基于 NotebookLM，让 AI 帮你划重点、出模拟题。",
      promoAction: "去试试 →",
    },
    vocabulary: {
      title: "荷兰语高频词汇 (A2)",
      description: "精选200+个荷兰生活、工作、行政高频词汇，配有发音和实用例句。",
      promoTitle: "A2 高频词汇表",
      promoDesc: "精选200+核心词汇，覆盖行政、医疗、生活全场景。",
      loadMore: "加载更多",
      showing: "正在展示",
      of: "共",
      categories: {
        all: "全部",
        daily: "日常生活",
        work: "工作",
        housing: "住房",
        health: "医疗",
        admin: "行政",
      },
    },
    disclaimer: {
      title: "免责声明",
      text: "本站内容由 AI 基于收集资料辅助生成，仅供参考。尽管我们努力确保质量，但无法保证信息 100% 准确或最新。请务必以荷兰政府官方信息为准。",
    },
    articleNav: {
      prev: "上一篇",
      next: "下一篇",
      home: "回到主页",
    },
  },
  en: {
    nav: {
      society: "Dutch Society",
      life: "Daily Life",
      knm: "KNM Zone",
      resources: "Resources",
      assistant: "AI Assistant",
      vocabulary: "Vocabulary",
      about: "About & Contribute",
    },
    footer: {
      tagline: "© open-knm — open knowledge for expats.",
      note: "Written for people living, studying, or working in the Netherlands.",
      discord: "Join our Discord Community",
    },
    assistant: {
      aiAssistantTitle: "NotebookLM AI Assistant",
      aiAssistantDesc:
        "NotebookLM already knows every open-knm note. Click through, ask it to explain a topic, or let it give you quick exam tips and memory tricks.",
      openNotebook: "Chat with the AI Assistant",
      badgeLabel: "AI Assistant",
      detailLine1: "NotebookLM reads the open-knm notes you are visiting and answers questions about the material.",
      detailLine2: "Tap the button, then ask it to summarize facts, generate mock questions, or explain tricky points.",
      detailLine3: "Content is community-sourced and reviewed, ensuring reliable answers.",
      highlightLine: "Share this page with your study group so everyone can spot the AI Assistant.",
      bannerTitle: "AI Assistant is live",
      bannerSubtitle: "Tap the button and let NotebookLM answer your KNM questions anytime.",
      promoTitle: "New: AI Assistant",
      promoDesc: "Powered by NotebookLM. Get summaries and mock questions instantly.",
      promoAction: "Try it now →",
    },
    vocabulary: {
      title: "Essential Dutch Vocabulary (A2)",
      description: "A curated list of 200+ essential words for daily life, work, and administration in the Netherlands, with audio and examples.",
      promoTitle: "A2 Essential Vocabulary",
      promoDesc: "200+ core words covering admin, health, and daily life.",
      loadMore: "Load More",
      showing: "Showing",
      of: "of",
      categories: {
        all: "All",
        daily: "Daily Life",
        work: "Work",
        housing: "Housing",
        health: "Health",
        admin: "Admin",
      },
    },
    disclaimer: {
      title: "Disclaimer",
      text: "Content is generated with AI assistance based on collected data. While we strive for accuracy, we cannot guarantee it is 100% correct or up-to-date. Please verify with official sources.",
    },
    articleNav: {
      prev: "Previous Article",
      next: "Next Article",
      home: "Back to Home",
    },
  },
};

function normalizePath(path: string) {
  if (!path || path === "/") {
    return "";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function getLocalizedPath(locale: Locale, path = "/") {
  const normalized = normalizePath(path);
  return normalized ? `/${locale}${normalized}` : `/${locale}`;
}
