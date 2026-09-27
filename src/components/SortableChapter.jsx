import "./components.css";
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable";
import SeriesChapter from "./SeriesChapter";

export default function SortableChapter({ chapters, onDelete, columns = 1, disabled = false }) {
  return (
    <SortableContext
      items={chapters.map((chapter) => chapter.id)}
      strategy={columns > 1 ? rectSortingStrategy : verticalListSortingStrategy}
    >
      <ul className={`sortable-chapters ${columns > 1 ? "is-grid" : ""}`}>
        {chapters.map((chapter, index) => (
          <SeriesChapter
            key={chapter.id}
            chapter={chapter}
            onDelete={onDelete}
            index={index}
            disabled={disabled}
          />
        ))}
      </ul>
    </SortableContext>
  );
}
