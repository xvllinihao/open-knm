"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Locale, getLocalizedPath } from "@/lib/uiTexts";
import { useAuth } from "@/contexts/AuthContext";
import { vocabularyList } from "@/data/vocabulary";
import { getArticlesByCategory } from "@/lib/articles";
import { createClient } from "@/utils/supabase/client";
import { checkWishlistStatus, leaveWishlist } from "@/app/actions/waitlist";

// 常量配置
const FREE_DAILY_FLASHCARD_LIMIT = 20;

export default function ProfilePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [isLeavingWishlist, setIsLeavingWishlist] = useState(false);

  // 从 localStorage 获取学习进度
  const [progress, setProgress] = useState({
    knmArticlesRead: 0,
    knmTotalArticles: 0,
    vocabularyPage: 0,
    vocabularyTotalPages: 0,
    vocabularyIsLearningMode: false,
    todayFlashcards: 0,
    flashcardMastery: 0, // Pro only: 0-100
  });

  const isZh = locale === "zh";
  const isPro = profile?.tier === "pro";

  const texts = {
    title: isZh ? "我的账户" : "My Account",
    memberSince: isZh ? "注册时间" : "Member since",
    tier: isZh ? "账户状态" : "Account Status",
    free: isZh ? "标准版" : "Basic",
    pro: isZh ? "已解锁单词包" : "Study Pack Unlocked",
    learningProgress: isZh ? "学习进度" : "Learning Progress",
    knmArticles: isZh ? "KNM 文章阅读" : "KNM Articles",
    vocabularyProgress: isZh ? "词汇学习进度" : "Vocabulary Progress",
    vocabularyLearningMode: isZh ? "学习模式" : "Learning Mode",
    vocabularySpeedMode: isZh ? "极速刷词模式不记录进度" : "Speed mode progress not tracked",
    page: isZh ? "页" : "pages",
    todayFlashcards: isZh ? "今日闪卡练习" : "Today's Flashcards",
    remaining: isZh ? "剩余" : "remaining",
    unlimited: isZh ? "无限" : "Unlimited",
    flashcardMastery: isZh ? "闪卡记忆进度" : "Flashcard Mastery",
    flashcardMasteryDesc: isZh ? "基于闪卡测试的单词掌握程度" : "Word mastery based on flashcard tests",
    proOnly: isZh ? "已解锁功能" : "Unlocked Feature",
    unlockWithPro: isZh ? "解锁后开启" : "Unlock to enable",
    upgradeToPro: isZh ? "解锁无限闪卡单词包" : "Unlock Unlimited Flashcards",
    proFeatures: isZh ? "解锁无限闪卡、乱序模式、生词同步等专属功能" : "Unlock unlimited flashcards, shuffle mode, sync & more",
    logout: isZh ? "退出登录" : "Log Out",
    email: isZh ? "邮箱" : "Email",
    articles: isZh ? "篇" : "articles",
    notStarted: isZh ? "未开始" : "Not started",
    complete: isZh ? "完成" : "complete",
    dangerZone: isZh ? "危险操作" : "Danger Zone",
    deleteAccount: isZh ? "删除账户" : "Delete Account",
    deleteWarning: isZh 
      ? "此操作不可撤销。删除账户后，所有数据将被永久移除。" 
      : "This action cannot be undone. All your data will be permanently removed.",
    deleteConfirmTitle: isZh ? "确认删除账户" : "Confirm Account Deletion",
    deleteConfirmText: isZh 
      ? "请输入 DELETE 以确认删除：" 
      : "Type DELETE to confirm:",
    cancel: isZh ? "取消" : "Cancel",
    confirmDelete: isZh ? "确认删除" : "Confirm Delete",
    deleting: isZh ? "删除中..." : "Deleting...",
    wishlistJoined: isZh ? "已将会员计划加入心愿单" : "Membership plan added to Wishlist",
    wishlistNotify: isZh ? "Pro 上线时我们会第一时间通知你" : "We'll notify you when Pro launches",
    joinWishlist: isZh ? "加入心愿单" : "Join Wishlist",
    leaveWishlist: isZh ? "退出心愿单" : "Leave Wishlist",
    leaving: isZh ? "退出中..." : "Leaving...",
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push(getLocalizedPath(locale, "/login"));
    }
  }, [user, loading, router, locale]);

  // 检查是否已加入心愿单
  useEffect(() => {
    async function checkStatus() {
      if (user?.email) {
        const onWishlist = await checkWishlistStatus(user.email);
        setIsOnWishlist(onWishlist);
      }
    }
    checkStatus();
  }, [user?.email]);

  useEffect(() => {
    // 读取本地存储的学习进度
    if (typeof window !== "undefined") {
      // KNM 文章阅读记录
      const knmHistory = localStorage.getItem("knm-read-history");
      const knmArticlesRead = knmHistory ? JSON.parse(knmHistory).length : 0;
      const knmTotalArticles = getArticlesByCategory("knm").length;

      // 词汇进度 - 读取 vocab-bookmark (VocabularyList 使用的 key)
      // 只记录学习模式 (card) 的进度
      const vocabBookmark = localStorage.getItem("vocab-bookmark");
      let vocabularyPage = 0;
      let vocabularyTotalPages = 0;
      let vocabularyIsLearningMode = false;
      if (vocabBookmark) {
        try {
          const parsed = JSON.parse(vocabBookmark);
          // 只有学习模式 (card) 才显示进度
          if (parsed.viewMode === 'card') {
            vocabularyPage = parsed.page || 1;
            vocabularyTotalPages = Math.ceil(vocabularyList.length / 6);
            vocabularyIsLearningMode = true;
          }
        } catch {
          // ignore parse error
        }
      }

      // 今日闪卡使用量
      const flashcardUsage = localStorage.getItem("flashcard-today-count");
      const todayFlashcards = flashcardUsage ? parseInt(flashcardUsage, 10) : 0;

      // 闪卡记忆进度 (Pro only) - 计算掌握程度
      let masteryValue = 0;
      if (isPro && profile?.unknown_words) {
        const totalWords = vocabularyList.length;
        const unknownCount = profile.unknown_words.length;
        masteryValue = Math.max(0, Math.round(((totalWords - unknownCount) / totalWords) * 100));
      } else {
        const flashcardMastery = localStorage.getItem("flashcard-mastery");
        masteryValue = flashcardMastery ? parseInt(flashcardMastery, 10) : 0;
      }

      setProgress({
        knmArticlesRead,
        knmTotalArticles,
        vocabularyPage,
        vocabularyTotalPages,
        vocabularyIsLearningMode,
        todayFlashcards,
        flashcardMastery: masteryValue,
      });
    }
  }, [isPro, profile?.unknown_words]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // 使用 window.location.href 进行硬刷新，确保服务端也获取到最新状态
      window.location.href = getLocalizedPath(locale, "/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
    // 注意: 成功时不调用 setIsLoggingOut(false)，因为页面会跳转
  };

  const handleLeaveWishlist = async () => {
    if (!user?.email) return;
    setIsLeavingWishlist(true);
    try {
      const result = await leaveWishlist(user.email);
      if (result.success) {
        setIsOnWishlist(false);
      }
    } catch (error) {
      console.error("Leave wishlist error:", error);
    } finally {
      setIsLeavingWishlist(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    
    setIsDeleting(true);
    setDeleteError("");

    try {
      const supabase = createClient();
      
      // 删除用户（这会触发 Supabase 的级联删除）
      const { error } = await supabase.rpc('delete_user');
      
      if (error) {
        // 如果 RPC 不存在，尝试直接登出并提示用户联系支持
        if (error.message.includes('function') || error.message.includes('not exist')) {
          // 清除本地数据
          localStorage.clear();
          await signOut();
          router.push(getLocalizedPath(locale, "/"));
          return;
        }
        throw error;
      }

      // 清除本地数据
      localStorage.clear();
      await signOut();
      router.push(getLocalizedPath(locale, "/"));
    } catch (error) {
      console.error("Delete account error:", error);
      setDeleteError(isZh ? "删除失败，请稍后重试或联系支持。" : "Deletion failed. Please try again or contact support.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const flashcardRemaining = isPro ? Infinity : Math.max(0, FREE_DAILY_FLASHCARD_LIMIT - progress.todayFlashcards);

  return (
    <div className="min-h-[60vh] max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {user.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{texts.title}</h1>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-slate-500">{texts.email}</span>
            <span className="font-medium text-slate-900">{user.email}</span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-slate-500">{texts.tier}</span>
            <span className={`font-bold px-3 py-1 rounded-full text-sm ${
              isPro 
                ? "bg-purple-100 text-purple-700" 
                : "bg-slate-100 text-slate-600"
            }`}>
              {isPro ? texts.pro : texts.free}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">{texts.memberSince}</span>
            <span className="font-medium text-slate-900">
              {user.created_at 
                ? new Date(user.created_at).toLocaleDateString(isZh ? "zh-CN" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Learning Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span>
          {texts.learningProgress}
        </h2>

        <div className="space-y-4">
          {/* KNM Articles */}
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇳🇱</span>
                <span className="text-slate-700">{texts.knmArticles}</span>
              </div>
              <span className="font-bold text-slate-900">
                {progress.knmArticlesRead} / {progress.knmTotalArticles} {texts.articles}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress.knmTotalArticles > 0 
                    ? Math.round((progress.knmArticlesRead / progress.knmTotalArticles) * 100) 
                    : 0}%` 
                }}
              />
            </div>
            {progress.knmArticlesRead > 0 && (
              <p className="text-xs text-slate-500 mt-1 text-right">
                {Math.round((progress.knmArticlesRead / progress.knmTotalArticles) * 100)}% {texts.complete}
              </p>
            )}
          </div>

          {/* Vocabulary Progress - Learning Mode Only */}
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <span className="text-slate-700">{texts.vocabularyProgress}</span>
                  <span className="text-xs text-slate-400 ml-2">({texts.vocabularyLearningMode})</span>
                </div>
              </div>
              <span className="font-bold text-slate-900">
                {progress.vocabularyIsLearningMode && progress.vocabularyPage > 0 
                  ? `${progress.vocabularyPage} / ${progress.vocabularyTotalPages} ${texts.page}` 
                  : texts.notStarted}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress.vocabularyIsLearningMode && progress.vocabularyTotalPages > 0 
                    ? Math.round((progress.vocabularyPage / progress.vocabularyTotalPages) * 100) 
                    : 0}%` 
                }}
              />
            </div>
            {progress.vocabularyIsLearningMode && progress.vocabularyPage > 0 ? (
              <p className="text-xs text-slate-500 mt-1 text-right">
                {Math.round((progress.vocabularyPage / progress.vocabularyTotalPages) * 100)}% {texts.complete}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                {texts.vocabularySpeedMode}
              </p>
            )}
          </div>

          {/* Today's Flashcards */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎴</span>
              <span className="text-slate-700">{texts.todayFlashcards}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900">
                {progress.todayFlashcards} / {isPro ? "∞" : FREE_DAILY_FLASHCARD_LIMIT}
              </span>
              {!isPro && (
                <span className="text-xs text-slate-500 block">
                  {texts.remaining}: {flashcardRemaining}
                </span>
              )}
              {isPro && (
                <span className="text-xs text-purple-600 font-medium block">
                  {texts.unlimited}
                </span>
              )}
            </div>
          </div>

          {/* Flashcard Mastery - Pro Only */}
          <div className={`p-3 rounded-xl relative ${isPro ? 'bg-slate-50' : 'bg-slate-100'}`}>
            {!isPro && (
              <div className="absolute inset-0 bg-slate-100/80 rounded-xl flex items-center justify-center z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium text-purple-700">{texts.unlockWithPro}</span>
                </div>
              </div>
            )}
            <div className={`${!isPro ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <span className="text-slate-700">{texts.flashcardMastery}</span>
                    {isPro && (
                      <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">PRO</span>
                    )}
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  {isPro ? `${progress.flashcardMastery}%` : '--'}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: isPro ? `${progress.flashcardMastery}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {texts.flashcardMasteryDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA / Wishlist Status (for free users) */}
      {!isPro && (
        isOnWishlist ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {texts.wishlistJoined}
                </h3>
                <p className="text-green-700 text-sm">{texts.wishlistNotify}</p>
              </div>
              <span className="text-2xl">💎</span>
            </div>
            <button
              onClick={handleLeaveWishlist}
              disabled={isLeavingWishlist}
              className="text-sm text-green-600 hover:text-green-800 underline underline-offset-2 disabled:opacity-50"
            >
              {isLeavingWishlist ? texts.leaving : texts.leaveWishlist}
            </button>
          </div>
        ) : (
          <Link
            href={getLocalizedPath(locale, "/resources")}
            className="block bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-6 hover:bg-purple-100 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-1">{texts.upgradeToPro}</h3>
                <p className="text-purple-700 text-sm">{texts.proFeatures}</p>
              </div>
              <span className="text-2xl">💎</span>
            </div>
          </Link>
        )
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 mb-8"
      >
        {isLoggingOut ? "..." : texts.logout}
      </button>

      {/* Danger Zone */}
      <div className="border border-red-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {texts.dangerZone}
        </h2>
        <p className="text-sm text-red-600 mb-4">{texts.deleteWarning}</p>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            {texts.deleteAccount}
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">
                {texts.deleteConfirmText}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            
            {deleteError && (
              <p className="text-sm text-red-600">{deleteError}</p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                  setDeleteError("");
                }}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                {texts.cancel}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? texts.deleting : texts.confirmDelete}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
