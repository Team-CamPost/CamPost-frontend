import { API_BASE_URL } from "../config/env";

const API_BASE = API_BASE_URL.replace(/\/$/, "");
const ABSOLUTE_URL_PATTERN = /^(https?:)?\/\//i;
const INLINE_URL_PATTERN = /^(data|blob):/i;

export const toBackendAssetUrl = (value: string | null | undefined) => {
  const path = value?.trim();

  if (!path) return "";
  if (ABSOLUTE_URL_PATTERN.test(path) || INLINE_URL_PATTERN.test(path)) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${API_BASE}${path}`;
  }
  return `${API_BASE}/${path}`;
};

export const toNoticeAssetUrl = (
  value: string | null | undefined,
  sourceUrl: string | null | undefined,
) => {
  const path = value?.trim();

  if (!path) return "";
  if (ABSOLUTE_URL_PATTERN.test(path) || INLINE_URL_PATTERN.test(path)) {
    return path;
  }
  if (path.startsWith("files/") || path.startsWith("/files/")) {
    return toBackendAssetUrl(path);
  }
  if (sourceUrl && sourceUrl !== "#") {
    try {
      return new URL(path, sourceUrl).toString();
    } catch {
      return path;
    }
  }
  return path;
};

export const rewriteNoticeAssetUrls = (
  html: string,
  sourceUrl: string | null | undefined,
) =>
  html.replace(
    /\s(src|href)=(["'])(.*?)\2/gi,
    (_match, attribute: string, quote: string, url: string) => {
      const rewrittenUrl = toNoticeAssetUrl(url, sourceUrl);
      return ` ${attribute}=${quote}${rewrittenUrl}${quote}`;
    },
  );

export const sanitizeNoticeHtml = (html: string) => {
  if (
    typeof window === "undefined" ||
    typeof DOMParser === "undefined" ||
    !html
  ) {
    return html;
  }

  const document = new DOMParser().parseFromString(html, "text/html");

  document
    .querySelectorAll("script, iframe, object, embed, link, meta")
    .forEach((element) => element.remove());

  document.body.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith("on")) {
        element.removeAttribute(attribute.name);
      }
      if (
        (name === "href" || name === "src") &&
        value.startsWith("javascript:")
      ) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
};
