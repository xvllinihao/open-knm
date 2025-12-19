"use server";

import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

// 初始化 Resend（如果有 API key）
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// 邮件发送速率限制 - 内存缓存（生产环境应使用 Redis）
const emailRateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 小时
const RATE_LIMIT_MAX_EMAILS = 3; // 每小时最多 3 封邮件

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const record = emailRateLimit.get(email);
  
  if (!record || now > record.resetAt) {
    emailRateLimit.set(email, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_EMAILS) {
    return false;
  }
  
  record.count++;
  return true;
}

// Turnstile Verification
async function verifyTurnstile(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
     console.error("TURNSTILE_SECRET_KEY is missing!");
     return false;
  }

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);

  try {
    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    });
    const outcome = await result.json();
    return outcome.success;
  } catch (e) {
    console.error("Turnstile error:", e);
    return false;
  }
}

export async function joinWaitlist(email: string, token?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is not logged in, they MUST provide a valid Turnstile token
  if (!user) {
     if (!token) {
        return { success: false, error: "Missing captcha token" };
     }
     const isHuman = await verifyTurnstile(token);
     if (!isHuman) {
        return { success: false, error: "Captcha verification failed" };
     }
  }
  
  // Basic validation
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  // 检查是否已存在（避免重复插入触发邮件）
  const { data: existing } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return { success: true, message: "Already on the list!" };
  }

  const { error } = await supabase
    .from("waitlist")
    .insert({ email });

  if (error) {
    if (error.code === "23505") { // Unique violation
      return { success: true, message: "Already on the list!" };
    }
    return { success: false, error: "Failed to join wishlist" };
  }

  // 发送确认邮件（带速率限制）
  console.log("[Wishlist] Attempting to send email:", { 
    hasResend: !!resend, 
    email,
    fromEmail: process.env.RESEND_FROM_EMAIL 
  });
  
  if (resend && checkRateLimit(email)) {
    try {
      console.log("[Wishlist] Sending email to:", email);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Open KNM <noreply@openknm.com>",
        to: email,
        subject: "🎉 You're on the Open KNM Pro Wishlist!",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Welcome to the Pro Wishlist! 💎</h1>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for joining the Open KNM Pro wishlist! You're now in line to get early access to:
            </p>
            
            <ul style="color: #475569; font-size: 16px; line-height: 1.8;">
              <li>🎴 Unlimited flashcard reviews</li>
              <li>🔀 Shuffle mode for better retention</li>
              <li>📊 Wrong answer tracking</li>
              <li>💰 50% off at launch!</li>
            </ul>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              We'll send you an email as soon as Pro is ready. In the meantime, keep practicing with our free vocabulary list and KNM articles!
            </p>
            
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 14px;">
                — The Open KNM Team<br>
                <a href="https://open-knm.org" style="color: #7c3aed;">open-knm.org</a>
              </p>
            </div>
          </div>
        `,
      });
      console.log("[Wishlist] Email sent successfully to:", email);
    } catch (emailError) {
      // 邮件发送失败不影响加入心愿单
      console.error("[Wishlist] Failed to send email:", emailError);
    }
  } else {
    console.log("[Wishlist] Email not sent:", { 
      hasResend: !!resend, 
      rateLimitPassed: resend ? checkRateLimit(email) : 'N/A' 
    });
  }

  return { success: true };
}

export async function leaveWishlist(email: string) {
  if (!email) {
    return { success: false, error: "Email required" };
  }

  const supabase = await createClient();
  
  const { error } = await supabase
    .from("waitlist")
    .delete()
    .eq("email", email);

  if (error) {
    console.error("Error leaving wishlist:", error);
    return { success: false, error: "Failed to leave wishlist" };
  }

  return { success: true };
}

export async function getWaitlistCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching waitlist count:", error);
    return 0;
  }

  return count || 0;
}

export async function checkWishlistStatus(email: string) {
  if (!email) return false;
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .single();

  if (error) {
    // PGRST116 means no rows found, which is expected
    if (error.code === "PGRST116") {
      return false;
    }
    console.error("Error checking wishlist status:", error);
    return false;
  }

  return !!data;
}
