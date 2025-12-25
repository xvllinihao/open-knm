import { Locale } from "@/lib/uiTexts";
import { use } from "react";
import Link from "next/link";

export default function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const isZh = locale === "zh";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">
          {isZh ? "服务条款" : "Terms of Service"}
        </h1>
        <p className="text-slate-500">
          {isZh ? "最后更新：2024年12月" : "Last updated: December 2024"}
        </p>
      </div>

      <div className="prose prose-slate max-w-none">
        {isZh ? (
          <>
            <h3>1. 服务说明</h3>
            <p>
              Open KNM 提供荷兰语学习辅助工具和内容。基础内容完全免费开源。我们提供可选的付费服务（如&quot;Pro 单词包&quot;）以解锁高级功能。
            </p>

            <h3>2. 账户与安全</h3>
            <p>
              您需要注册账户以保存学习进度。请妥善保管您的账户凭证。我们采取合理措施保护您的数据安全。
            </p>

            <h3>3. 付费服务</h3>
            <p>
              Pro 单词包为一次性付费产品。激活码一经使用绑定账户，不支持退款，除非法律另有规定或产品存在重大缺陷。
            </p>

            <h3>4. 免责声明</h3>
            <p>
              本站内容仅供学习参考，不作为官方 KNM 考试的权威依据。AI 生成内容可能存在误差，请以荷兰政府官方信息为准。
            </p>

            <h3>5. 联系我们</h3>
            <p>
              如有疑问，请通过资源页面的&quot;联系客服&quot;功能与我们取得联系。
            </p>
          </>
        ) : (
          <>
            <h3>1. Service Description</h3>
            <p>
              Open KNM provides Dutch language learning tools and content. Basic content is free and open source. We offer optional paid services (such as &quot;Pro Vocabulary Pack&quot;) to unlock advanced features.
            </p>

            <h3>2. Account & Security</h3>
            <p>
              You need to register an account to save learning progress. Please keep your account credentials safe. We take reasonable measures to protect your data.
            </p>

            <h3>3. Paid Services</h3>
            <p>
              The Pro Vocabulary Pack is a one-time purchase. Once an activation code is used and bound to an account, it is non-refundable, unless otherwise required by law or if the product has significant defects.
            </p>

            <h3>4. Disclaimer</h3>
            <p>
              Content on this site is for learning reference only and should not be considered an authoritative source for the KNM exam. AI-generated content may contain errors; please refer to official Dutch government information.
            </p>

            <h3>5. Contact Us</h3>
            <p>
              If you have questions, please use the &quot;Contact Support&quot; feature on the Resources page.
            </p>
          </>
        )}
      </div>

      <div className="pt-8 border-t border-slate-100">
        <Link 
          href={`/${locale}/resources`}
          className="text-[var(--primary)] hover:underline font-medium"
        >
          ← {isZh ? "返回资源页面" : "Back to Resources"}
        </Link>
      </div>
    </div>
  );
}

