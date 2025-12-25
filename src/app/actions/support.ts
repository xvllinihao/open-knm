"use server";

import { Resend } from "resend";
import { verifyTurnstile } from "@/utils/turnstile";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Simple rate limiting in memory (same as waitlist)
const supportRateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 3;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = supportRateLimit.get(identifier);
  
  if (!record || now > record.resetAt) {
    supportRateLimit.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

export type SupportResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function sendSupportMessage(email: string, message: string, turnstileToken: string): Promise<SupportResult> {
  if (!turnstileToken) {
    return { success: false, error: "Security verification missing" };
  }

  const isHuman = await verifyTurnstile(turnstileToken);
  if (!isHuman) {
    return { success: false, error: "Security check failed" };
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  if (!message || message.trim().length < 10) {
    return { success: false, error: "Message too short" };
  }

  if (!checkRateLimit(email)) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  if (!resend) {
    console.warn("Resend API key missing, logging support message instead:", { email, message });
    return { success: true, message: "Message logged (Dev mode)" };
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL; 
  if (!adminEmail) {
    console.error("ADMIN_EMAIL and RESEND_FROM_EMAIL are missing. Cannot send support message.");
    return { success: false, error: "Support email not configured." };
  }
  
  const destination = adminEmail;

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    console.error("RESEND_FROM_EMAIL is missing. Cannot send support message.");
    return { success: false, error: "Support email not configured." };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: destination,
      replyTo: email, // Reply to the user
      subject: `[Support Request] from ${email}`,
      text: `User Email: ${email}\n\nMessage:\n${message}`,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send support email:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}

