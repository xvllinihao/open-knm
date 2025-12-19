import { Locale, isLocale } from "@/lib/uiTexts";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Open KNM",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const isZh = locale === "zh";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-10 border-b border-slate-200 pb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          {isZh ? "隐私政策" : "Privacy Policy"}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-500 text-sm">
          <span>
            {isZh ? "最后更新：2025年12月14日" : "Last Updated: December 14, 2025"}
          </span>
        </div>
      </div>

      <div className="space-y-10 text-slate-700 leading-relaxed">
        <div>
          <p className="text-lg text-slate-600 mb-8">
            {isZh
              ? "Open KNM 是一个开源项目。我们尊重您的隐私，并承诺保护您的个人数据。以下是我们如何收集、使用和保护您的信息的说明。"
              : "Open KNM is an open-source project. We respect your privacy and are committed to protecting your personal data. Here is how we collect, use, and safeguard your information."}
          </p>
        </div>

        {isZh ? (
          <>
            <PolicySection
              title="1. 数据收集"
              content="我们本身不存储任何用户的个人身份信息（如姓名、邮箱、地址等）。作为一个静态网站，我们没有后端数据库来保存用户账户数据。"
            />

            <PolicySection
              title="2. 第三方分析工具"
              content={
                <>
                  <p className="mb-3">为了优化网站体验和了解用户需求，我们使用了以下第三方分析工具：</p>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>
                      <strong className="text-slate-900">Google Analytics 4 (GA4)</strong>: 用于收集匿名的访问统计数据，如页面浏览量、访问来源和停留时间。Google Analytics 可能会使用 Cookies 来识别唯一的（匿名）用户。
                    </li>
                    <li>
                      <strong className="text-slate-900">PostHog</strong>: 用于产品分析，帮助我们改进功能。我们已配置 PostHog 以尽量减少数据收集，并且不记录敏感个人信息。
                    </li>
                  </ul>
                </>
              }
            />

            <PolicySection
              title="3. Cookies 的使用"
              content="本网站使用 Cookies 主要是为了上述的分析功能以及记住您的语言偏好（如您手动切换了语言）。您可以通过浏览器设置随时清除或禁用 Cookies。"
            />

            <PolicySection
              title="4. 外部链接"
              content="本网站包含指向第三方网站（如 IND, Rijksoverheid, GitHub 等）的链接。我们对这些外部网站的内容或隐私做法不承担责任。"
            />

            <PolicySection
              title="5. 联系我们"
              content="如果您对本隐私政策有任何疑问，请通过 GitHub Issues 或 Discord 社区联系我们。"
            />
          </>
        ) : (
          <>
            <PolicySection
              title="1. Data Collection"
              content="We do not store any personally identifiable information (PII) such as names, emails, or addresses. As a static website, we do not have a backend database to hold user account data."
            />

            <PolicySection
              title="2. Third-Party Analytics"
              content={
                <>
                  <p className="mb-3">To improve the website experience and understand user needs, we use the following third-party analytics tools:</p>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>
                      <strong className="text-slate-900">Google Analytics 4 (GA4)</strong>: Used to collect anonymous traffic statistics, such as page views, traffic sources, and session duration. Google Analytics may use Cookies to identify unique (anonymous) users.
                    </li>
                    <li>
                      <strong className="text-slate-900">PostHog</strong>: Used for product analytics to help us improve features. We have configured PostHog to minimize data collection and do not record sensitive personal information.
                    </li>
                  </ul>
                </>
              }
            />

            <PolicySection
              title="3. Use of Cookies"
              content="This website uses Cookies primarily for the analytics functions mentioned above and to remember your language preference. You can clear or disable Cookies at any time through your browser settings."
            />

            <PolicySection
              title="4. External Links"
              content="This website contains links to third-party websites (e.g., IND, Rijksoverheid, GitHub). We are not responsible for the content or privacy practices of these external sites."
            />

            <PolicySection
              title="5. Contact Us"
              content="If you have any questions about this Privacy Policy, please contact us via GitHub Issues or our Discord community."
            />
          </>
        )}
      </div>
    </div>
  );
}

function PolicySection({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-600 leading-relaxed">
        {content}
      </div>
    </section>
  );
}


