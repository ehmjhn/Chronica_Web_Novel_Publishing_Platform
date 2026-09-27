import { useCallback, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./ChapterEditor.css";
import { InlineMessage } from "./States";
import { LIMITS } from "../lib/validation";

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "blockquote",
  "link",
];

const isBlank = (html) => !html || html === "<p><br></p>" || html === "<p></p>";

/**
 * Shared chapter editor for AddChapter and EditChapter.
 *
 * The two pages had drifted into separate, subtly broken implementations. The
 * worst of them wired the rich-text `onChange` to `console.log`, so an author's
 * edits were never stored and every "Update Chapter" click saved the original
 * text. Both pages now share this controlled editor, so the value the author
 * sees is the value that gets written.
 */
export default function ChapterEditor({
  initialTitle = "",
  initialContent = "",
  submitLabel = "Save Chapter",
  busy = false,
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  // Quill reports a plain string delta-ish; keep only the HTML.
  const handleContentChange = useCallback((value) => {
    setContent(typeof value === "string" ? value : "");
  }, []);

  const wordCount = useMemo(() => {
    const text = String(content)
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim()) return setError("Please add a chapter title.");
    if (isBlank(content)) return setError("Please write some chapter content.");
    if (title.length > LIMITS.chapterTitle)
      return setError(`Keep the chapter title under ${LIMITS.chapterTitle} characters.`);

    onSubmit({ chapterTitle: title.trim(), content });
  }

  return (
    <form ref={formRef} className="chapter-editor" onSubmit={handleSubmit} noValidate>
      <div className="chapter-editor__field">
        <label htmlFor="chapter-title">Chapter Title</label>
        <input
          id="chapter-title"
          type="text"
          value={title}
          maxLength={LIMITS.chapterTitle}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter chapter title…"
        />
        <small className="muted">
          {title.length}/{LIMITS.chapterTitle}
        </small>
      </div>

      <div className="chapter-editor__field">
        <label htmlFor="chapter-content">Chapter Content</label>
        <ReactQuill
          className="chapter-content"
          theme="snow"
          modules={MODULES}
          formats={FORMATS}
          value={content}
          onChange={handleContentChange}
          placeholder="Write your chapter here…"
        />
        <small className="muted">
          {wordCount} word{wordCount === 1 ? "" : "s"}
        </small>
      </div>

      <InlineMessage tone="error">{error}</InlineMessage>

      <div className="chapter-editor__actions">
        <button type="submit" className="save-btn" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-gray" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
