import { Locale, isLocale } from "@/lib/uiTexts";
import { notFound } from "next/navigation";

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  
  if (!isLocale(locale)) {
    notFound();
  }

  const isZh = locale === "zh";

  // Replace this with your actual GitHub repository URL
  const GITHUB_REPO = "https://github.com/xvllinihao/open-knm"; 

  return (
    <div className="max-w-3xl mx-auto space-y-16 py-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-widest mb-2">
          {isZh ? '社区驱动 · 开源免费' : 'Community Driven · Open Source'}
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">
          {isZh ? '关于 Open KNM' : 'About Open KNM'}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
          {isZh 
            ? '让每一位在荷兰生活的人都能轻松获取融入所需的知识。'
            : 'Making integration knowledge accessible to everyone living in the Netherlands.'}
        </p>
      </div>

      {/* Author's Note - Fancy Version */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-2xl ring-1 ring-white/10">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-600 opacity-10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-8 border-b border-white/10 pb-8">
             <div className="relative">
               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-orange-600 flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/20">
                 👨‍💻
               </div>
               <div className="absolute -bottom-1 -right-1 bg-white text-[10px] font-bold text-slate-900 px-2 py-0.5 rounded-full shadow-sm">
                 DEV
               </div>
             </div>
             
             <div>
               <h2 className="text-2xl font-bold text-white mb-1">
                 {isZh ? '作者的话' : "Author's Note"}
               </h2>
               <p className="text-slate-400 text-sm mb-3">
                 {isZh ? '来自 Booking.com 的工程师' : 'Engineer at Booking.com'}
               </p>
               <div className="flex gap-3 text-xs font-bold tracking-wide">
                  <a href="https://github.com/xvllinihao" target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/li-xu-412015216/" target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5]/20 hover:bg-[#0077b5]/40 text-[#0077b5] hover:text-white ring-1 ring-[#0077b5]/50 transition-all">
                    LinkedIn
                  </a>
               </div>
             </div>
          </div>
          
          <div className="space-y-4 text-lg leading-relaxed text-slate-300 font-light">
             <p>
               {isZh 
                 ? "你好！我是一名在荷兰生活和工作了 5 年的工程师，目前在 Booking.com 工作。和你一样，我也正在为荷兰语融入考试（Inburgering）做准备。"
                 : "Hi! I'm an engineer at Booking.com, living and working in the Netherlands for 5 years. Just like you, I am currently preparing for the civic integration exam (Inburgering)."}
             </p>
             <p>
               {isZh
                 ? "在备考过程中，我发现自己其实对这个生活了很久的国家依然知之甚少。而市面上的学习资料要么是晦涩的荷兰语原版书，要么是零散的英文信息。我想：为什么不能有一个结构清晰、中英双语对照的开源知识库呢？"
                 : "During my preparation, I realized how little I actually knew about this country despite living here for so long. The available materials were either dense Dutch textbooks or scattered English info. I thought: why not build a clear, bilingual, open-source knowledge hub?"}
             </p>
             <p className="text-white font-medium">
               {isZh
                 ? "于是 Open KNM 诞生了。希望它不仅能帮我们通过考试，更能帮助大家真正了解并爱上在这个国家的生活。"
                 : "So Open KNM was born. I hope it helps us pass the exam, but more importantly, helps everyone truly understand and enjoy life in this country."}
             </p>
          </div>
        </div>
      </section>

      {/* Contribution Guide (Restored & Enhanced) */}
      <section className="space-y-8 pt-8">
        <div className="border-b border-slate-100 pb-4">
            <h2 className="text-3xl font-bold text-slate-900">
            {isZh ? '如何参与贡献' : 'How to Contribute'}
            </h2>
            <p className="text-slate-500 mt-2">
            {isZh ? '这个项目属于每一个人。我们需要你的帮助！' : 'This project belongs to everyone. We need your help!'}
            </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
            {/* Way 1: Report Issues */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                    🐛
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                    {isZh ? '发现错误 / 提出建议' : 'Report Issues / Suggestions'}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed h-20">
                    {isZh 
                    ? '如果你发现文章中有错别字、信息过时，或者有想看但没找到的内容，请直接在 GitHub 上提交 Issue。'
                    : 'Found a typo? Outdated info? Or missing content you want to see? Please open an Issue on GitHub.'}
                </p>
                <a 
                    href={`${GITHUB_REPO}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-bold text-blue-600 hover:underline"
                >
                    {isZh ? '去提 Issue' : 'Open an Issue'} →
                </a>
            </div>

            {/* Way 2: Submit Code/Content */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl">
                    💻
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                    {isZh ? '贡献代码 / 内容' : 'Contribute Code / Content'}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed h-20">
                    {isZh 
                    ? '你可以直接 Fork 仓库，修改或添加 MDX 文档，然后提交 Pull Request。我们会尽快审核合并！'
                    : 'Fork the repo, edit or add MDX files, and submit a Pull Request. We will review and merge it ASAP!'}
                </p>
                <a 
                    href={`${GITHUB_REPO}/pulls`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-bold text-green-600 hover:underline"
                >
                    {isZh ? '提交 PR' : 'Submit PR'} →
                </a>
            </div>
        </div>

        {/* GitHub Link Box (Restored) */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-6">
            <h3 className="text-2xl font-bold">
                {isZh ? '准备好加入了吗？' : 'Ready to join us?'}
            </h3>
            <p className="text-slate-300 max-w-lg mx-auto">
                {isZh 
                 ? '访问我们的 GitHub 仓库，给项目点一颗 ⭐ Star，让更多人看到这个项目。'
                 : 'Visit our GitHub repository, give us a ⭐ Star, and help more people find this project.'}
            </p>
            <a 
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Repo
            </a>
        </div>
      </section>
    </div>
  );
}
