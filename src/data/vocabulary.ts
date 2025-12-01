import data from "./vocabulary.json";

export type VocabularyItem = {
  id: string;
  dutch: string;
  translations: {
    en: string;
    zh: string;
  };
  notes: {
    en: string;
    zh: string;
  };
  category: "daily" | "work" | "housing" | "health" | "admin";
  level: "A2";
};

export const vocabularyList = data as VocabularyItem[];
