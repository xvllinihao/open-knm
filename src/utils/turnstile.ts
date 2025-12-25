export async function verifyTurnstile(token: string): Promise<boolean> {
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
    
    if (!outcome.success) {
      console.error("Turnstile verification failed. Error codes:", outcome['error-codes']);
    }

    return outcome.success;
  } catch (e) {
    console.error("Turnstile error:", e);
    return false;
  }
}

