import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router";
import "./components.css";

/**
 * One draggable chapter row.
 *
 * `disabled` turns off dragging without removing the row, so the same markup
 * serves read-only and editable views. The old version passed the chapter id
 * as the story id to `onDelete`, which silently targeted the wrong series.
 */
function SeriesChapter({ chapter, onDelete, index, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
    disabled,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  };

  const formatDay = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      : "—";

  return (
    <li ref={setNodeRef} style={style} className="chapter-card">
      <div className="chapter-info">
        <span
          className={`chapter-drag-handle ${disabled ? "is-disabled" : ""}`}
          aria-hidden={disabled || undefined}
        >
          <i className="fa-solid fa-bars" />
        </span>

        <div>
          <span className="chapter-order">{chapter.order ?? index + 1}</span>{" "}
          <span className="chapter-card__title">{chapter.chapterTitle}</span>
          <span className="chapter-date">
            {formatDay(chapter.publishDate)}
            {chapter.updatedDate && ` · updated ${formatDay(chapter.updatedDate)}`}
          </span>
        </div>
      </div>

      <div className="chapter-control-icons">
        <Link
          to={`/read-chapter/${chapter.id}`}
          aria-label={`Preview ${chapter.chapterTitle}`}
          title="Preview"
        >
          <i className="fa-solid fa-eye" aria-hidden="true" />
        </Link>
        <Link
          to={`/edit-chapter/${chapter.id}`}
          aria-label={`Edit ${chapter.chapterTitle}`}
          title="Edit"
        >
          <i className="fa-solid fa-pen-fancy" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(chapter)}
          aria-label={`Delete ${chapter.chapterTitle}`}
          title="Delete"
        >
          <i className="fa-solid fa-trash" aria-hidden="true" />
        </button>

        {!disabled && (
          <button
            type="button"
            className="chapter-drag-handle chapter-drag-handle--button"
            aria-label={`Reorder ${chapter.chapterTitle}`}
            {...listeners}
            {...attributes}
          >
            <i className="fa-solid fa-grip-vertical" aria-hidden="true" />
          </button>
        )}
      </div>
    </li>
  );
}

export default SeriesChapter;
