// Chapter bodies are authored as rich text (Quill) and stored as HTML, then
// rendered with dangerouslySetInnerHTML. Without sanitising, any author could
// inject <script>, event-handler attributes, or javascript: URLs and run code
// in every reader's browser (stored XSS). Always render chapter content
// through `sanitizeChapterHtml`.

import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "code",
  "a", "span", "div", "hr", "img", "figure", "figcaption",
];

const ALLOWED_ATTR = ["href", "title", "target", "rel", "class", "src", "alt", "width", "height"];

// Authors can paste links that open in a new tab. Without noopener the opened
// page gets a handle on window.opener and can navigate this tab (reverse
// tabnabbing), so force the safe rel on every surviving link.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer nofollow");
  }
});

export function sanitizeChapterHtml(html) {
  if (!html) return "";

  return DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // Block javascript:, data:, and vbscript: URIs in href/src.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
  });
}

const EMPTY_HTML = /^\s*(<p>\s*(<br\s*\/?>)?\s*<\/p>|<br\s*\/?>|&nbsp;)\s*$/i;

export function isEmptyChapterContent(html) {
  if (!html) return true;
  const stripped = String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, "")
    .trim();
  return stripped === "" || EMPTY_HTML.test(String(html).trim());
}

export function plainTextExcerpt(html, maxLength = 180) {
  if (!html) return "";
  const text = DOMPurify.sanitize(String(html), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
