import './components.css'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SeriesChapter from './SeriesChapter';

function SortableChapter ({ chapters }) {
  return (
    <>
        <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
            {chapters.map((chapter) => (
                <SeriesChapter key={chapter.id} {...chapter}/>
            ))}
        </SortableContext>
    </>
  );
}

export default SortableChapter
