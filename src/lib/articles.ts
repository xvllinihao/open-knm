export type Category = "society" | "life" | "knm";

import { Locale } from "./uiTexts";

export type KnmTheme =
  | "geschiedenis en geografie"
  | "wonen"
  | "staatsinrichting en rechtsstaat"
  | "werk en inkomen"
  | "instanties"
  | "onderwijs en opvoeding"
  | "omgangsvormen, waarden en normen"
  | "gezondheid en gezondheidszorg";

export type Article = {
  slug: string;
  category: Category;
  theme?: KnmTheme;
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
    theme: "geschiedenis en geografie",
    titles: titleFor(
      "荷兰历史：威廉·奥兰治与八十年战争",
      "History: William of Orange & 80 Years' War"
    ),
    descriptions: descFor(
      "了解荷兰国父威廉·奥兰治（Willem van Oranje）以及荷兰独立的起源。",
      "Learn about the Father of the Nation and the origins of Dutch independence."
    ),
    tags: ["geschiedenis en geografie"],
  },
  {
    slug: "knm-history-ww2",
    category: "knm",
    theme: "geschiedenis en geografie",
    titles: titleFor(
      "荷兰历史：二战与解放",
      "History: World War II & Liberation"
    ),
    descriptions: descFor(
      "德国入侵、安妮·弗兰克、饥饿之冬以及每年的死难者纪念日与解放日。",
      "German invasion, Anne Frank, Hunger Winter, and Remembrance/Liberation Day."
    ),
    tags: ["geschiedenis en geografie"],
  },
  {
    slug: "knm-history-republic-golden-age",
    category: "knm",
    theme: "geschiedenis en geografie",
    titles: titleFor(
      "荷兰历史：共和国与黄金时代",
      "History: The Republic & Golden Age"
    ),
    descriptions: descFor(
      "八十年战争、荷兰东印度公司（VOC）以及荷兰如何成为世界贸易强国。",
      "The Eighty Years' War, the VOC, and how the Netherlands became a global trade power."
    ),
    tags: ["geschiedenis en geografie"],
  },
  {
    slug: "knm-geography-water-management",
    category: "knm",
    theme: "geschiedenis en geografie",
    titles: titleFor(
      "荷兰地理：与水共存的历史",
      "Geography: Living with Water"
    ),
    descriptions: descFor(
      "低于海平面的国家如何生存？了解围海造田（Polder）与三角洲工程（Deltawerken）。",
      "How does a country below sea level survive? Polders and Delta Works."
    ),
    tags: ["geschiedenis en geografie"],
  },

  // --- KNM: Politics & Law ---
  {
    slug: "knm-politics-democracy",
    category: "knm",
    theme: "staatsinrichting en rechtsstaat",
    titles: titleFor(
      "政治制度：议会民主与君主立宪",
      "Politics: Parliamentary Democracy"
    ),
    descriptions: descFor(
      "荷兰的国王管什么？首相怎么选出来的？第二议院（Tweede Kamer）是做什么的？",
      "Role of the King, Prime Minister, and the House of Representatives (Tweede Kamer)."
    ),
    tags: ["staatsinrichting en rechtsstaat"],
  },
  {
    slug: "knm-law-constitution",
    category: "knm",
    theme: "staatsinrichting en rechtsstaat",
    titles: titleFor(
      "基本法：荷兰宪法第一条",
      "Law: Article 1 of the Constitution"
    ),
    descriptions: descFor(
      "“在荷兰，所有人在同等情况下应受到同等对待。”了解反歧视法的核心。",
      "Treating everyone equally. Understanding the core of anti-discrimination laws."
    ),
    tags: ["staatsinrichting en rechtsstaat"],
  },

  // --- KNM: Health & Education ---
  {
    slug: "knm-education-system",
    category: "knm",
    theme: "onderwijs en opvoeding",
    titles: titleFor(
      "教育体系：从小学到大学的分流",
      "Education: The School System"
    ),
    descriptions: descFor(
      "Basisschool 之后发生了什么？VMBO, HAVO, VWO 到底有什么区别？",
      "What happens after primary school? Differences between VMBO, HAVO, and VWO."
    ),
    tags: ["onderwijs en opvoeding"],
  },
  {
    slug: "knm-health-huisarts",
    category: "knm",
    theme: "gezondheid en gezondheidszorg",
    titles: titleFor(
      "医疗系统：家庭医生（Huisarts）的角色",
      "Healthcare: The General Practitioner (Huisarts)"
    ),
    descriptions: descFor(
      "为什么看专科医生必须先过家庭医生这一关？",
      "Why you must see a GP before a specialist in the Netherlands."
    ),
    tags: ["gezondheid en gezondheidszorg"],
  },
  {
    slug: "knm-healthcare-maternity",
    category: "knm",
    theme: "gezondheid en gezondheidszorg",
    titles: titleFor(
      "母婴健康：助产士与产后护理",
      "Healthcare: Midwifery & Maternity Care"
    ),
    descriptions: descFor(
      "怀孕了找谁？助产士（Verloskundige）与产后护理（Kraamzorg）的作用。",
      "Who to see when pregnant? The role of midwives and maternity care."
    ),
    tags: ["gezondheid en gezondheidszorg"],
  },
  {
    slug: "knm-social-care-elderly-disabled",
    category: "knm",
    theme: "gezondheid en gezondheidszorg",
    titles: titleFor(
      "社会护理：老年人与残疾人支持",
      "Social Care: Elderly & Disabled Support"
    ),
    descriptions: descFor(
      "了解居家护理（Thuiszorg）、护理院以及荷兰对残疾人独立生活的支持。",
      "Learn about home care, nursing homes, and support for independent living."
    ),
    tags: ["gezondheid en gezondheidszorg"],
  },

  // --- KNM: Institutions ---
  {
    slug: "knm-government-institutions",
    category: "knm",
    theme: "instanties",
    titles: titleFor(
      "政府机构：DigiD、身份证件与公共服务",
      "Institutions: DigiD, ID & Public Services"
    ),
    descriptions: descFor(
      "如何与政府沟通？了解 DigiD、身份证件规定以及重要的政府机构。",
      "How to interact with the government? Learn about DigiD, ID rules, and key institutions."
    ),
    tags: ["instanties"],
  },

  // --- KNM: Work & Income ---
  {
    slug: "knm-work-contracts",
    category: "knm",
    theme: "werk en inkomen",
    titles: titleFor(
      "工作与收入：合同类型与试用期",
      "Work: Contracts & Probation"
    ),
    descriptions: descFor(
      "永久合同与临时合同的区别，以及解雇保护的基本知识。",
      "Permanent vs temporary contracts, and basic dismissal protection."
    ),
    tags: ["werk en inkomen"],
  },
  {
    slug: "knm-social-welfare-allowances",
    category: "knm",
    theme: "werk en inkomen",
    titles: titleFor(
      "社会福利：津贴与失业救济",
      "Welfare: Allowances & Benefits"
    ),
    descriptions: descFor(
      "了解失业金（WW）、救济金（Bijstand）以及房租和医疗津贴（Toeslagen）。",
      "Understanding unemployment benefits, social assistance, and rent/healthcare allowances."
    ),
    tags: ["werk en inkomen"],
  },

  // --- KNM: Housing & Environment ---
  {
    slug: "knm-housing-household",
    category: "knm",
    theme: "wonen",
    titles: titleFor(
      "住房管理：租房、买房与税务",
      "Housing: Renting, Buying & Taxes"
    ),
    descriptions: descFor(
      "社会房与私人租房的区别，房产税（OZB）与必选保险。",
      "Social vs private housing, property tax (OZB), and mandatory insurances."
    ),
    tags: ["wonen"],
  },
  {
    slug: "knm-environment-waste",
    category: "knm",
    theme: "wonen",
    titles: titleFor(
      "环境规则：垃圾分类与罚款",
      "Environment: Waste Separation & Fines"
    ),
    descriptions: descFor(
      "GFT、化学垃圾怎么扔？丢错垃圾会有什么后果？",
      "How to separate GFT and chemical waste? Consequences of wrong disposal."
    ),
    tags: ["wonen"],
  },

  // --- KNM: Culture & Daily Life ---
  {
    slug: "knm-social-etiquette",
    category: "knm",
    theme: "omgangsvormen, waarden en normen",
    titles: titleFor(
      "社交礼仪：拜访与冲突解决",
      "Etiquette: Visiting & Conflict Resolution"
    ),
    descriptions: descFor(
      "荷兰人的三吻礼、预约文化，以及邻里冲突的解决步骤。",
      "Three kisses, appointments, and solving neighbor disputes."
    ),
    tags: ["omgangsvormen, waarden en normen"],
  },
  {
    slug: "knm-culture-holidays",
    category: "knm",
    theme: "omgangsvormen, waarden en normen",
    titles: titleFor(
      "荷兰节日：国王节与传统",
      "Culture: Holidays & Traditions"
    ),
    descriptions: descFor(
      "国王节、Sinterklaas、以及必须知道的法定假日与传统。",
      "King's Day, Sinterklaas, and essential public holidays & traditions."
    ),
    tags: ["omgangsvormen, waarden en normen"],
  },
];

export function getArticlesByCategory(category: Category): Article[] {
  return articles.filter((article) => article.category === category);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getAdjacentArticles(slug: string): {
  prev?: Article;
  next?: Article;
} {
  const index = articles.findIndex((article) => article.slug === slug);
  if (index === -1) {
    return {};
  }
  const prev = index > 0 ? articles[index - 1] : undefined;
  const next = index < articles.length - 1 ? articles[index + 1] : undefined;
  return { prev, next };
}
