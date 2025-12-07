import React, { use } from "react";
import { Locale } from "@/lib/uiTexts";
import VocabularyList from "@/components/VocabularyList";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const isZh = locale === 'zh';

  return {
    title: isZh 
      ? "免费荷兰语A2核心词汇表 (带发音) | Open KNM" 
      : "Free Essential Dutch Vocabulary (A2) List | Open KNM",
    description: isZh
      ? "掌握500+个荷兰语A2核心词汇，涵盖日常生活、融入考试(Inburgering)、工作和住房。包含免费真人发音、例句和中文解释。助你轻松通过荷兰语A2考试。"
      : "Master 300+ essential Dutch words for daily life, civic integration (inburgering) exams, work, and housing. Includes free audio pronunciations, examples and translations.",
    keywords: isZh
      ? ["免费荷兰语A2词汇", "荷兰语A2学习", "融入考试词汇", "Inburgering单词", "荷兰语入门", "荷兰语单词表", "荷兰生活词汇", "免费荷兰语学习", "荷兰语自学"]
      : ["Free Dutch A2 vocabulary", "Learn Dutch A2", "Inburgering vocabulary", "Dutch A2 words", "Dutch vocabulary list", "Netherlands A2 exam", "Free Dutch learning"],
    openGraph: {
      title: isZh 
        ? "免费荷兰语A2核心词汇表 (带发音)" 
        : "Free Essential Dutch Vocabulary (A2) List",
      description: isZh
        ? "500+个荷兰语高频词汇，助你通过融入考试。包含免费发音和例句。"
        : "500+ essential Dutch words to help you pass the civic integration exam. Includes free audio and examples.",
    },
  };
}

export default function VocabularyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  return <VocabularyList locale={locale} />;
}
