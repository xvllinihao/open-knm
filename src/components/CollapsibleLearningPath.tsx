"use client";

import { useState } from "react";

type Props = {
  isZh: boolean;
};

export function CollapsibleLearningPath({ isZh }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="w-full max-w-4xl mx-auto">
      {/* Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-slate-600 hover:text-slate-700 transition-colors group"
      >
        <span className="text-2xl">🤔</span>
        <span className="text-base sm:text-lg font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
          {isZh
            ? "不知道从哪里开始？点这里查看学习路线"
            : "Not sure where to start? Click here for learning path"}
        </span>
        <span
          className={`text-orange-500 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {isZh ? "📚 新手学习路线" : "📚 Learning Path for Beginners"}
          </h2>
          <p className="text-slate-600">
            {isZh
              ? "按照这个顺序准备，事半功倍。"
              : "Follow this path for efficient exam preparation."}
          </p>
        </div>

        {/* Integration Exam Introduction */}
        <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🇳🇱</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isZh ? "什么是融入考试？" : "What is the Inburgering Exam?"}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                {isZh
                  ? "融入考试（Inburgeringsexamen）是荷兰政府要求的新移民融入考试。通过考试是获得永久居留或入籍的必要条件。考试包括听力、阅读、写作、口语和 KNM（荷兰社会知识）五个部分。"
                  : "The Inburgeringsexamen is a civic integration exam required by the Dutch government for new immigrants. Passing it is mandatory for permanent residency or naturalization. The exam consists of five parts: Listening, Reading, Writing, Speaking, and KNM (Knowledge of Dutch Society)."}
              </p>
              <a
                href={isZh ? "https://www.inburgeren.nl/zh/" : "https://www.inburgeren.nl/en/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{isZh ? "了解更多官方信息 →" : "Learn more on official website →"}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="group p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                1
              </span>
              <span className="text-lg font-bold text-slate-900">
                {isZh ? "A2 词汇" : "A2 Vocabulary"}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isZh
                ? "先掌握基础词汇，阅读和听力考试就能轻松应对。"
                : "Master the basics first, then reading and listening become much easier."}
            </p>
          </div>

          {/* Step 2 */}
          <div className="group p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                2
              </span>
              <span className="text-lg font-bold text-slate-900">
                {isZh ? "KNM 知识" : "KNM Knowledge"}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isZh
                ? "有了词汇基础，KNM 的历史、法律、文化内容就能看懂了。"
                : "With vocabulary foundation, history, law, and culture content becomes accessible."}
            </p>
          </div>

          {/* Step 3 */}
          <div className="group p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                3
              </span>
              <span className="text-lg font-bold text-slate-900">
                {isZh ? "写作 & 口语" : "Writing & Speaking"}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isZh
                ? "最后冲刺写作和口语考试，使用模板和模拟练习。"
                : "Final push for writing and speaking exams with templates and practice."}
            </p>
          </div>

          {/* Bonus */}
          <div className="group p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🎁</span>
              <span className="text-lg font-bold text-slate-900">
                {isZh ? "更多资源" : "More Resources"}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isZh
                ? "AI 助手里有更多免费资料，支持 NotebookLM 交互学习。"
                : "Free materials in our AI assistant with NotebookLM interactive learning."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
