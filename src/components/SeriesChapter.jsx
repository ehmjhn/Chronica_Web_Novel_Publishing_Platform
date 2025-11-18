import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NavLink } from 'react-router';
import { deleteChapter } from '../firebase/db';

function SeriesChapter({ id, chapterId, title, date }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });


  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: 'grab'
  };

  function handleDelete() {
    const userChoice = confirm("Do you want to delete this chapter?")

    if (userChoice) {
      deleteChapter(id, chapterId)
    }

  }
  return (
    <div ref={setNodeRef} style={style} className="chapter-card">
      <div className="chapter-info">
        <i className="fa-solid fa-bars" {...listeners} {...attributes}></i>
        <div>
          <span>{title}</span>
          <span className="chapter-date">
            {new Date(date).toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}{" "}
            {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </div>
      <div className="chapter-control-icons">
        <i className="fa-solid fa-trash" onClick={handleDelete}></i>
        <NavLink to={`/edit-chapter/${chapterId}`}><i className="fa-solid fa-pen-fancy"></i></NavLink>
      </div>
    </div>
  );
}

export default SeriesChapter;
