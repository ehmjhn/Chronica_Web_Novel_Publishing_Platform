import './components.css';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SeriesChapter from './SeriesChapter';

function SortableChapter({ chapters }) {
  return (
    <SortableContext
      items={chapters.map(ch => ch.id)}
      strategy={verticalListSortingStrategy}
      disabled={false}
    >
      {chapters.map((chapter) => (
        <SeriesChapter
          key={chapter.id}
          id={chapter.id}
          chapterId={chapter.id}
          title={chapter.chapterTitle}
          date={chapter.publishDate}
        />
      ))}
    </SortableContext>
  );
}

export default SortableChapter;
