"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { verifyTurnstile } from "@/utils/turnstile";

export type ActivationResult = {
  success: boolean;
  error?: string;
};

export async function activateLicense(code: string, userId: string, turnstileToken?: string): Promise<ActivationResult> {
  // 0. Verify Turnstile
  if (turnstileToken) {
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return { success: false, error: "Security check failed. Please try again." };
    }
  } else {
    // Ideally we enforce token, but for backward compatibility or testing might be optional
    // Given the user request, we should probably enforce it, but let's check if it's safe.
    // If we are calling from client, we should provide it.
    // Let's enforce it.
    return { success: false, error: "Security check required." };
  }

  const supabase = createAdminClient();
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return { success: false, error: "Please enter a valid code" };
  }

  // 1. Handle XHS Code (Starts with XHS-)
  if (normalizedCode.startsWith("XHS-")) {
    const { data, error } = await supabase
      .from("license_keys")
      .select("*")
      .eq("key", normalizedCode)
      .eq("is_used", false)
      .single();

    if (error || !data) {
      return { success: false, error: "Invalid or already used XHS code" };
    }

    // Update license key usage
    const { error: updateKeyError } = await supabase
      .from("license_keys")
      .update({
        is_used: true,
        used_by: userId,
        activated_at: new Date().toISOString()
      })
      .eq("key", normalizedCode);

    if (updateKeyError) {
      console.error("Error updating license key:", updateKeyError);
      return { success: false, error: "Failed to process activation" };
    }

    // Upgrade user to pro
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ tier: "pro", updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (profileError) {
      console.error("Error upgrading user profile:", profileError);
      return { success: false, error: "Code used but failed to upgrade account. Please contact support." };
    }

    return { success: true };
  }

  // 2. Handle Lemon Squeezy Code
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  
  try {
    // Use the official Lemon Squeezy License API v1 endpoint
    // Note: License API doesn't strictly require the API key in headers
    const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({ license_key: normalizedCode }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[License] Lemon Squeezy API error:", response.status, errorText);
      return { success: false, error: "License server returned an error" };
    }

    const data = await response.json();

    if (data.valid) {
      // Upgrade user to pro
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ tier: "pro", updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (profileError) {
        console.error("Error upgrading user profile (LS):", profileError);
        return { success: false, error: "Code validated but failed to upgrade account" };
      }

      return { success: true };
    } else {
      return { success: false, error: data.error || "Invalid Lemon Squeezy license key" };
    }
  } catch (err) {
    console.error("Lemon Squeezy validation failed:", err);
    return { success: false, error: "Failed to connect to license server" };
  }
}

