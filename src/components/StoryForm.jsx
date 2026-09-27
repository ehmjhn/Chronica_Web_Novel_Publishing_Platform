import { useMemo, useState } from "react";
import "./StoryForm.css";
import { useToast } from "./toast-context";
import { InlineMessage } from "./States";
import { useFilePreview } from "../hooks/useForm";
import { uploadCoverImage } from "../firebase/db";
import {
  GENRES,
  TAGS,
  STORY_STATUSES,
  CONTENT_WARNINGS,
  COPYRIGHT_OPTIONS,
  MAX_GENRES,
  MAX_TAGS,
  PLACEHOLDER_COVER,
} from "../lib/constants.js";
import { LIMITS } from "../lib/validation";

const EMPTY = {
  title: "",
  synopsis: "",
  status: "Ongoing",
  copyright: "All Rights Reserved",
  contentWarning: "None",
  genre: [],
  tags: [],
  coverImage: "",
};

/**
 * Shared create/edit form for a series.
 *
 * CreateStory and EditStory had drifted apart: EditStory hard-coded its own
 * genre/tag lists (so anything an author picked in CreateStory could vanish)
 * and rejected saves unless the user re-uploaded the cover image. Both now use
 * this component, which only uploads when a *new* file was chosen.
 *
 * The form owns its draft state. When the caller loads data asynchronously it
 * must pass `key={storyId}` so the component remounts with fresh values.
 */
export default function StoryForm({
  initial = EMPTY,
  submitLabel = "Save Series",
  busy = false,
  onSubmit,
}) {
  const toast = useToast();
  const { preview, file, error: fileError, select } = useFilePreview();

  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const set = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const toggleIn = (key, limit) => (value) =>
    setValues((current) => {
      const list = current[key];
      if (list.includes(value)) return { ...current, [key]: list.filter((item) => item !== value) };
      if (list.length >= limit) {
        toast.info(`You can pick up to ${limit} ${key === "genre" ? "genres" : "tags"}.`);
        return current;
      }
      return { ...current, [key]: [...list, value] };
    });

  const availableGenres = useMemo(() => GENRES, []);
  const availableTags = useMemo(() => TAGS, []);

  function validate() {
    const next = {};
    if (!values.title.trim()) next.title = "A title is required.";
    else if (values.title.length > LIMITS.title) next.title = `Keep the title under ${LIMITS.title} characters.`;

    if (!values.synopsis.trim()) next.synopsis = "A synopsis is required.";
    else if (values.synopsis.length > LIMITS.synopsis)
      next.synopsis = `Keep the synopsis under ${LIMITS.synopsis} characters.`;

    if (!values.genre.length) next.genre = "Pick at least one genre.";
    if (!values.tags.length) next.tags = "Pick at least one tag.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy || uploading) return;
    if (!validate()) return;

    let coverImage = values.coverImage;
    if (file) {
      setUploading(true);
      try {
        coverImage = await uploadCoverImage(file);
      } catch (err) {
        setUploading(false);
        toast.error(err.message);
        return;
      }
      setUploading(false);
    }

    await onSubmit({ ...values, coverImage: coverImage || PLACEHOLDER_COVER });
  }

  const working = uploading || busy;

  return (
    <form onSubmit={handleSubmit} className="create-form-container" noValidate>
      <div className="create-form-section image-section">
        <label className="create-form-label" htmlFor="cover-file">
          Cover Image
        </label>
        <p className="create-form-note">
          250x350 pixels is recommended. NSFW or suggestive images are not allowed.
        </p>

        <div className="create-form-image-preview">
          {preview || values.coverImage ? (
            <img src={preview || values.coverImage} alt="Cover preview" className="create-form-cover" />
          ) : (
            <div className="create-form-placeholder">No Image</div>
          )}
        </div>

        <input
          id="cover-file"
          type="file"
          accept="image/*"
          className="create-form-file"
          onChange={(event) => select(event.target.files?.[0])}
        />
        {fileError && <InlineMessage tone="error">{fileError}</InlineMessage>}
        {values.coverImage && !file && <small className="muted">Your current cover will be kept.</small>}
      </div>

      <div className="create-form-section">
        <label className="create-form-label" htmlFor="story-title">
          Title
        </label>
        <input
          id="story-title"
          type="text"
          value={values.title}
          maxLength={LIMITS.title}
          onChange={set("title")}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <InlineMessage tone="error">{errors.title}</InlineMessage>}
      </div>

      <div className="create-form-section">
        <label className="create-form-label" htmlFor="story-synopsis">
          Synopsis
        </label>
        <textarea
          id="story-synopsis"
          rows={5}
          value={values.synopsis}
          maxLength={LIMITS.synopsis}
          onChange={set("synopsis")}
          aria-invalid={Boolean(errors.synopsis)}
        />
        <small className="muted">{values.synopsis.length}/{LIMITS.synopsis}</small>
        {errors.synopsis && <InlineMessage tone="error">{errors.synopsis}</InlineMessage>}
      </div>

      <div className="create-form-section">
        <label className="create-form-label" htmlFor="genre-select">
          Genres (max {MAX_GENRES})
        </label>
        <select
          id="genre-select"
          value=""
          onChange={(event) => toggleIn("genre", MAX_GENRES)(event.target.value)}
        >
          <option value="">Select a genre</option>
          {availableGenres.map((genre) => (
            <option key={genre} value={genre} disabled={values.genre.includes(genre)}>
              {genre}
            </option>
          ))}
        </select>
        <div className="create-form-chip-list">
          {values.genre.map((genre) => (
            <span key={genre} className="create-form-chip">
              {genre}
              <button
                type="button"
                className="create-form-remove-chip"
                onClick={() => toggleIn("genre", MAX_GENRES)(genre)}
                aria-label={`Remove ${genre}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.genre && <InlineMessage tone="error">{errors.genre}</InlineMessage>}
      </div>

      <div className="create-form-section">
        <label className="create-form-label" htmlFor="tag-select">
          Tags (max {MAX_TAGS})
        </label>
        <select
          id="tag-select"
          value=""
          onChange={(event) => toggleIn("tags", MAX_TAGS)(event.target.value)}
        >
          <option value="">Select a tag</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag} disabled={values.tags.includes(tag)}>
              {tag}
            </option>
          ))}
        </select>
        <div className="create-form-chip-list">
          {values.tags.map((tag) => (
            <span key={tag} className="create-form-chip">
              {tag}
              <button
                type="button"
                className="create-form-remove-chip"
                onClick={() => toggleIn("tags", MAX_TAGS)(tag)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.tags && <InlineMessage tone="error">{errors.tags}</InlineMessage>}
      </div>

      <div className="create-form-section create-form-flex">
        <div>
          <label className="create-form-label" htmlFor="content-warning">
            Content Warning
          </label>
          <select id="content-warning" value={values.contentWarning} onChange={set("contentWarning")}>
            {CONTENT_WARNINGS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="create-form-label" htmlFor="story-status">
            Story Status
          </label>
          <select id="story-status" value={values.status} onChange={set("status")}>
            {STORY_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="create-form-label" htmlFor="story-copyright">
            Copyright
          </label>
          <select id="story-copyright" value={values.copyright} onChange={set("copyright")}>
            {COPYRIGHT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="create-form-actions">
        <button type="submit" className="create-form-submit" disabled={working}>
          {uploading ? "Uploading cover…" : busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
