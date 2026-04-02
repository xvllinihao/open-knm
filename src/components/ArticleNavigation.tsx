import Link from "next/link";
import { Article } from "@/lib/articles";
import { Locale, uiTexts } from "@/lib/uiTexts";

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
      clipRule="evenodd"
    />
  </svg>
);

type ArticleNavigationProps = {
  prev?: Article;
  next?: Article;
  locale: Locale;
};

export function ArticleNavigation({ prev, next, locale }: ArticleNavigationProps) {
  const t = uiTexts[locale].articleNav;

  return (
    <nav className="border-t border-slate-200 mt-12 pt-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/${locale}/articles/${prev.slug}`}
            className="group flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all text-left h-full"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2 group-hover:text-[var(--primary)] transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              {t.prev}
            </div>
            <div className="text-lg font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
              {prev.titles[locale]}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/${locale}/articles/${next.slug}`}
            className="group flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all text-right h-full items-end"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2 group-hover:text-[var(--primary)] transition-colors">
              {t.next}
              <ArrowRightIcon className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
              {next.titles[locale]}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <HomeIcon className="w-4 h-4" />
          {t.home}
        </Link>
      </div>
    </nav>
  );
}

