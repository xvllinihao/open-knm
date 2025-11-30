const FALLBACK_SITE_URL = "https://open-knm.org";

const normalizeUrl = (url: string) => {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const resolveSiteUrl = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_URL;

  return envUrl ? normalizeUrl(envUrl) : FALLBACK_SITE_URL;
};

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Open KNM";

export const absoluteUrl = (path = "/") => {
  if (!path) {
    return SITE_URL;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
};

