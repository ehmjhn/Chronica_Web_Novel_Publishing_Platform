import { useEffect, useRef, useState } from "react";
import { isEmptyChapterContent } from "../lib/sanitize";

/** Tracks whether the rich-text editor currently holds a non-empty document. */
export function useChapterDraft(initialContent = "") {
  const [content, setContent] = useState(initialContent);
  const [isEmpty, setIsEmpty] = useState(() => isEmptyChapterContent(initialContent));

  const onChange = (value) => {
    setContent(value);
    setIsEmpty(isEmptyChapterContent(value));
  };

  const reset = (value = "") => {
    setContent(value);
    setIsEmpty(isEmptyChapterContent(value));
  };

  return { content, isEmpty, onChange, setContent, reset };
}

/** Debounces a rapidly changing value, e.g. a search box. */
export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/** Reads a file as a data URL for local image preview. */
export function useFilePreview() {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const objectUrl = useRef(null);

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    []
  );

  const select = (selected) => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
    if (!selected) {
      setFile(null);
      setPreview("");
      return;
    }
    if (!selected.type?.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5 MB.");
      return;
    }

    setError("");
    setFile(selected);
    const url = URL.createObjectURL(selected);
    objectUrl.current = url;
    setPreview(url);
  };

  return { preview, file, error, select, clear: () => select(null) };
}
