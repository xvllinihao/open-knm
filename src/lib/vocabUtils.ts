import { vocabularyList, VocabularyItem } from "@/data/vocabulary";

/**
 * Find vocabulary items that appear as whole words in the given Dutch text.
 * Skips trivially short words, pronouns, and articles.
 * Deduplicates: if both "afspraak" and "afspraak maken" match, only the longer phrase is kept.
 */
export function findVocabInText(dutchText: string, limit = 6): VocabularyItem[] {
  const allFound: VocabularyItem[] = [];
  const seen = new Set<string>();

  for (const item of vocabularyList) {
    if (seen.has(item.id)) continue;
    if (item.dutch.length <= 2) continue;
    if (item.partOfSpeech === "pronoun" || item.partOfSpeech === "article") continue;

    const escaped = item.dutch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![a-zA-ZÀ-ÿ])${escaped}(?![a-zA-ZÀ-ÿ])`, "i");

    if (regex.test(dutchText)) {
      seen.add(item.id);
      allFound.push(item);
    }
  }

  // Remove items whose dutch text is a substring of a longer found item
  // e.g. keep "afspraak maken" and drop "afspraak" if both matched
  const deduped = allFound.filter(
    (item) =>
      !allFound.some(
        (other) =>
          other.id !== item.id &&
          other.dutch.toLowerCase().includes(item.dutch.toLowerCase()) &&
          other.dutch.length > item.dutch.length
      )
  );

  return deduped.slice(0, limit);
}
