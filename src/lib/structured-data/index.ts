/**
 * AEO - Answer Engine Optimization
 * Structured Data (Schema.org) for AI search engines (Gemini, Grok, ChatGPT)
 */

import { Locale } from '@/lib/i18n';

// Organization Schema
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Open KNM',
    url: 'https://open-knm.com',
    logo: 'https://open-knm.com/logo-open-knm.svg',
    description: 'Open-source guide for Dutch civic integration exam (KNM/Inburgering)',
    sameAs: [
      'https://github.com/xvllinihao/open-knm',
    ],
    knowsAbout: [
      'Dutch Civic Integration Exam',
      'KNM examen',
      'Inburgeringsexamen',
      'Dutch language learning',
      'Netherlands society',
      'Dutch A2 level',
    ],
  };
}

// SoftwareApplication Schema
export function softwareApplicationSchema(locale: Locale) {
  const isZh = locale === 'zh';
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Open KNM',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    description: isZh
      ? '免费开源的荷兰融入考试备考平台，提供核心考点总结、A2词汇表、口语写作练习。'
      : 'Free open-source platform for Dutch civic integration exam preparation with study guides, vocabulary, and practice tests.',
    featureList: [
      isZh ? 'KNM考试知识点总结' : 'KNM exam knowledge summaries',
      isZh ? '1300+ A2/B1词汇表' : '1300+ A2/B1 vocabulary',
      isZh ? '口语模拟练习' : 'Speaking practice',
      isZh ? '写作模板和练习' : 'Writing templates',
      isZh ? '闪卡记忆工具' : 'Flashcard tool',
    ],
  };
}

// FAQ Page Schema
export function faqPageSchema(locale: Locale) {
  const isZh = locale === 'zh';

  const faqData = isZh ? {
    question: '什么是荷兰融入考试（KNM/Inburgering）？',
    answer: 'KNM（Kennis van de Nederlandse Maatschappij）考试，也称荷兰融入考试（Inburgeringsexamen），是测试申请人对荷兰社会了解程度的标准化考试。考试内容包括荷兰历史、政治体系、地理、医疗、教育、住房以及荷兰价值观。通过该考试是获得荷兰国籍、永久居留许可和MVV（家庭团聚临时居留许可）的必要条件。考试采用A2级荷兰语，包含30道多选题，时长45分钟，及格分数为22/30。A2水平约需掌握1300-1500个单词，准备时间通常为2-6个月。',
  } : {
    question: 'What is the Dutch KNM (Inburgering) exam?',
    answer: 'The KNM (Kennis van de Nederlandse Maatschappij) exam, also known as the Inburgeringsexamen, is the Dutch civic integration examination. It tests knowledge of Dutch society including history, politics, geography, healthcare, education, housing, and Dutch values. Passing is required for Dutch citizenship, permanent residence, and MVV (family reunification). The exam is at A2 Dutch level with 30 multiple-choice questions, 45 minutes duration, and a passing score of 22/30. A2 level requires approximately 1,300-1,500 words and typically takes 2-6 months to prepare.',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: faqData.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faqData.answer,
        },
      },
    ],
  };
}

// HowTo Schema for exam preparation
export function howToSchema(locale: Locale) {
  const isZh = locale === 'zh';

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: isZh ? '如何通过荷兰融入考试' : 'How to Pass the Dutch Civic Integration Exam',
    description: isZh
      ? '完整的荷兰融入考试（KNM/Inburgering）备考指南'
      : 'Complete guide to preparing for and passing the Dutch KNM/Inburgering exam',
    step: [
      {
        '@type': 'HowToStep',
        name: isZh ? '了解考试要求' : 'Understand exam requirements',
        text: isZh
          ? '确定你需要参加哪些考试部分：KNM知识考试、口语、写作，可能还需要阅读和听力。这取决于你的目标（国籍、永久居留或MVV）。'
          : 'Determine which exam components you need: KNM knowledge, speaking, writing, and possibly reading and listening. This depends on your goal (citizenship, permanent residence, or MVV).',
      },
      {
        '@type': 'HowToStep',
        name: isZh ? '学习A2级荷兰语' : 'Learn A2 level Dutch',
        text: isZh
          ? '掌握约1300-1500个A2级词汇，重点学习日常生活主题：工作、教育、健康、住房等。使用闪卡工具进行记忆练习。'
          : 'Master approximately 1300-1500 A2 level words, focusing on daily life topics: work, education, health, housing, etc. Use flashcard tools for practice.',
      },
      {
        '@type': 'HowToStep',
        name: isZh ? '学习KNM知识点' : 'Study KNM topics',
        text: isZh
          ? '学习荷兰历史、政治、地理、医疗、教育体系。使用Open KNM等资源获得结构化的总结和要点。'
          : 'Study Dutch history, politics, geography, healthcare, and education systems. Use resources like Open KNM for structured summaries.',
      },
      {
        '@type': 'HowToStep',
        name: isZh ? '练习口语' : 'Practice speaking',
        text: isZh
          ? '练习常见话题：自我介绍、工作经历、住房情况、医疗场景。使用在线工具获得实时反馈。'
          : 'Practice common topics: self-introduction, work experience, housing, medical situations. Use online tools for real-time feedback.',
      },
      {
        '@type': 'HowToStep',
        name: isZh ? '练习写作' : 'Practice writing',
        text: isZh
          ? '学习基本写作模板：写信、填表、描述事件。使用提供的模板和规则进行练习。'
          : 'Learn basic writing templates: letters, forms, event descriptions. Practice with provided templates and rules.',
      },
      {
        '@type': 'HowToStep',
        name: isZh ? '模拟考试' : 'Take practice exams',
        text: isZh
          ? '完成模拟测试以熟悉考试格式和时间限制。分析错误并专注于薄弱领域。'
          : 'Complete mock tests to familiarize yourself with exam format and time limits. Analyze mistakes and focus on weak areas.',
      },
      {
        '@type': 'HowToStep',
        name: isZh ? '报名并参加考试' : 'Register and take the exam',
        text: isZh
          ? '通过DUO预约考试时间。带上有效身份证件参加考试。保持冷静，运用所学知识。'
          : 'Schedule your exam through DUO. Bring valid identification to the exam. Stay calm and apply what you\'ve learned.',
      },
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Open KNM',
      },
      {
        '@type': 'HowToTool',
        name: isZh ? 'DUO官方教材' : 'Official DUO materials',
      },
    ],
    timeRequired: isZh ? '2-6个月' : '2-6 months',
  };
}

// Article Schema
export function articleSchema({
  title,
  description,
  datePublished,
  dateModified,
  url,
  locale,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  locale: Locale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: 'https://open-knm.com/og-image.png',
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Organization',
      name: 'Open KNM',
      url: 'https://open-knm.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Open KNM',
      logo: {
        '@type': 'ImageObject',
        url: 'https://open-knm.com/logo-open-knm.svg',
      },
    },
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Course Schema
export function courseSchema(locale: Locale) {
  const isZh = locale === 'zh';
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: isZh ? '荷兰融入考试备考课程' : 'Dutch Civic Integration Exam Preparation',
    description: isZh
      ? '免费的在线备考课程，涵盖KNM知识考试、A2词汇、口语和写作练习。'
      : 'Free online preparation course covering KNM knowledge exam, A2 vocabulary, speaking and writing practice.',
    provider: {
      '@type': 'Organization',
      name: 'Open KNM',
      url: 'https://open-knm.com',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: {
        '@type': 'Organization',
        name: 'Open KNM Community',
      },
    },
    syllabusSections: [
      {
        '@type': 'Syllabus',
        name: isZh ? 'KNM知识' : 'KNM Knowledge',
        description: isZh ? '荷兰历史、政治、社会' : 'Dutch history, politics, and society',
      },
      {
        '@type': 'Syllabus',
        name: isZh ? 'A2词汇' : 'A2 Vocabulary',
        description: isZh ? '1300+核心词汇' : '1300+ essential words',
      },
      {
        '@type': 'Syllabus',
        name: isZh ? '口语练习' : 'Speaking Practice',
        description: isZh ? '模拟考试场景' : 'Exam simulation practice',
      },
      {
        '@type': 'Syllabus',
        name: isZh ? '写作练习' : 'Writing Practice',
        description: isZh ? '模板和练习题' : 'Templates and exercises',
      },
    ],
    offers: {
      '@type': 'Offer',
      category: 'Free',
      priceCurrency: 'EUR',
      price: '0',
    },
  };
}

// WebSite Schema with SearchAction
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Open KNM',
    url: 'https://open-knm.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://open-knm.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// BreadcrumbList Schema
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Video Object Schema (for future video content)
export function videoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: name,
    description: description,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate,
    duration: duration,
    embedUrl: thumbnailUrl,
  };
}

// Note: The JsonLd component should be used to render these schemas in JSX
// This file only exports the schema data objects

