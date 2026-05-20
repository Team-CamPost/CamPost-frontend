import DOMPurify from "dompurify";
import { API_BASE_URL } from "../config/env";

const API_BASE = API_BASE_URL.replace(/\/$/, "");
const ABSOLUTE_URL_PATTERN = /^(https?:)?\/\//i;
const INLINE_URL_PATTERN = /^(data|blob):/i;

const ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "caption",
  "col",
  "colgroup",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

const ALLOWED_ATTR = [
  "alt",
  "class",
  "colspan",
  "headers",
  "height",
  "href",
  "loading",
  "rel",
  "rowspan",
  "scope",
  "span",
  "src",
  "target",
  "title",
  "width",
];

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
) => {
  if (!html || typeof DOMParser === "undefined") return html;

  const document = new DOMParser().parseFromString(html, "text/html");

  document.querySelectorAll<HTMLElement>("[src]").forEach((element) => {
    const src = element.getAttribute("src");
    element.setAttribute("src", toNoticeAssetUrl(src, sourceUrl));
  });

  document.querySelectorAll<HTMLAnchorElement>("[href]").forEach((element) => {
    const href = element.getAttribute("href");
    element.setAttribute("href", toNoticeAssetUrl(href, sourceUrl));

    if (element.target === "_blank") {
      element.rel = "noopener noreferrer";
    }
  });

  return document.body.innerHTML;
};

export const sanitizeNoticeHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: [
      "script",
      "iframe",
      "object",
      "embed",
      "link",
      "meta",
      "svg",
      "math",
    ],
    FORBID_ATTR: ["style"],
  });
