export type Category = "society" | "life" | "knm";

import { Locale } from "./uiTexts";

export type Article = {
  slug: string;
  category: Category;
  titles: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  featured?: boolean;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
};

const titleFor = (zh: string, en: string) => ({ zh, en });
const descFor = (zh: string, en: string) => ({ zh, en });

export const articles: Article[] = [
  // --- KNM: History & Geography ---
  {
    slug: "knm-history-william-of-orange",
    category: "knm",
    titles: titleFor(
      "荷兰历史：威廉·奥兰治与八十年战争",
      "History: William of Orange & 80 Years' War"
    ),
    descriptions: descFor(
      "了解荷兰国父威廉·奥兰治（Willem van Oranje）以及荷兰独立的起源。",
      "Learn about the Father of the Nation and the origins of Dutch independence."
    ),
    tags: ["History", "Geography"],
  },
  {
    slug: "knm-geography-water-management",
    category: "knm",
    titles: titleFor(
      "荷兰地理：与水共存的历史",
      "Geography: Living with Water"
    ),
    descriptions: descFor(
      "低于海平面的国家如何生存？了解围海造田（Polder）与三角洲工程（Deltawerken）。",
      "How does a country below sea level survive? Polders and Delta Works."
    ),
    tags: ["Geography"],
  },

  // --- KNM: Politics & Law ---
  {
    slug: "knm-politics-democracy",
    category: "knm",
    titles: titleFor(
      "政治制度：议会民主与君主立宪",
      "Politics: Parliamentary Democracy"
    ),
    descriptions: descFor(
      "荷兰的国王管什么？首相怎么选出来的？第二议院（Tweede Kamer）是做什么的？",
      "Role of the King, Prime Minister, and the House of Representatives (Tweede Kamer)."
    ),
    tags: ["Politics", "Law"],
  },
  {
    slug: "knm-law-constitution",
    category: "knm",
    titles: titleFor(
      "基本法：荷兰宪法第一条",
      "Law: Article 1 of the Constitution"
    ),
    descriptions: descFor(
      "“在荷兰，所有人在同等情况下应受到同等对待。”了解反歧视法的核心。",
      "Treating everyone equally. Understanding the core of anti-discrimination laws."
    ),
    tags: ["Law"],
  },

  // --- KNM: Health & Education ---
  {
    slug: "knm-education-system",
    category: "knm",
    titles: titleFor(
      "教育体系：从小学到大学的分流",
      "Education: The School System"
    ),
    descriptions: descFor(
      "Basisschool 之后发生了什么？VMBO, HAVO, VWO 到底有什么区别？",
      "What happens after primary school? Differences between VMBO, HAVO, and VWO."
    ),
    tags: ["Education"],
  },
  {
    slug: "knm-health-huisarts",
    category: "knm",
    titles: titleFor(
      "医疗系统：家庭医生（Huisarts）的角色",
      "Healthcare: The General Practitioner (Huisarts)"
    ),
    descriptions: descFor(
      "为什么看专科医生必须先过家庭医生这一关？",
      "Why you must see a GP before a specialist in the Netherlands."
    ),
    tags: ["Health"],
  },
  {
    slug: "knm-healthcare-maternity",
    category: "knm",
    titles: titleFor(
      "母婴健康：助产士与产后护理",
      "Healthcare: Midwifery & Maternity Care"
    ),
    descriptions: descFor(
      "怀孕了找谁？助产士（Verloskundige）与产后护理（Kraamzorg）的作用。",
      "Who to see when pregnant? The role of midwives and maternity care."
    ),
    tags: ["Health"],
  },

  // --- KNM: Work & Income ---
  {
    slug: "knm-work-contracts",
    category: "knm",
    titles: titleFor(
      "工作与收入：合同类型与试用期",
      "Work: Contracts & Probation"
    ),
    descriptions: descFor(
      "永久合同与临时合同的区别，以及解雇保护的基本知识。",
      "Permanent vs temporary contracts, and basic dismissal protection."
    ),
    tags: ["Work"],
  },
  {
    slug: "knm-social-welfare-allowances",
    category: "knm",
    titles: titleFor(
      "社会福利：津贴与失业救济",
      "Welfare: Allowances & Benefits"
    ),
    descriptions: descFor(
      "了解失业金（WW）、救济金（Bijstand）以及房租和医疗津贴（Toeslagen）。",
      "Understanding unemployment benefits, social assistance, and rent/healthcare allowances."
    ),
    tags: ["Work", "Finance"],
  },

  // --- KNM: Housing & Environment ---
  {
    slug: "knm-housing-household",
    category: "knm",
    titles: titleFor(
      "住房管理：租房、买房与税务",
      "Housing: Renting, Buying & Taxes"
    ),
    descriptions: descFor(
      "社会房与私人租房的区别，房产税（OZB）与必选保险。",
      "Social vs private housing, property tax (OZB), and mandatory insurances."
    ),
    tags: ["Housing", "Finance"],
  },
  {
    slug: "knm-environment-waste",
    category: "knm",
    titles: titleFor(
      "环境规则：垃圾分类与罚款",
      "Environment: Waste Separation & Fines"
    ),
    descriptions: descFor(
      "GFT、化学垃圾怎么扔？丢错垃圾会有什么后果？",
      "How to separate GFT and chemical waste? Consequences of wrong disposal."
    ),
    tags: ["Environment"],
  },

  // --- KNM: Culture & Daily Life ---
  {
    slug: "knm-social-etiquette",
    category: "knm",
    titles: titleFor(
      "社交礼仪：拜访与冲突解决",
      "Etiquette: Visiting & Conflict Resolution"
    ),
    descriptions: descFor(
      "荷兰人的三吻礼、预约文化，以及邻里冲突的解决步骤。",
      "Three kisses, appointments, and solving neighbor disputes."
    ),
    tags: ["Culture"],
  },

  // --- Society (Broader Context) ---
  {
    slug: "society-norms-values",
    category: "society",
    titles: titleFor(
      "社会价值观：直言不讳与协商文化",
      "Values: Directness & Poldermodel"
    ),
    descriptions: descFor(
      "为什么荷兰人说话这么直？什么是“协商模型”（Poldermodel）？",
      "Why are Dutch people so direct? What is the 'Poldermodel'?"
    ),
    tags: ["Culture"],
  },
];

export function getArticlesByCategory(category: Category): Article[] {
  return articles.filter((article) => article.category === category);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
