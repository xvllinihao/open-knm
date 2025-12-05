import React, { use } from "react";
import { Locale } from "@/lib/uiTexts";
import VocabularyList from "@/components/VocabularyList";

export const metadata = {
  title: "Essential Dutch Vocabulary (A2) | Open KNM",
  description:
    "Master 300+ essential Dutch words for daily life, civic integration (inburgering) exams, work, and housing. Free audio pronunciations included.",
  openGraph: {
    title: "Essential Dutch Vocabulary (A2)",
    description:
      "Curated list of 300+ core Dutch words you actually need. Includes audio, translations, and usage notes.",
  },
};

export default function VocabularyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  return <VocabularyList locale={locale} />;
}
