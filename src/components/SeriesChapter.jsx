import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { NavLink } from 'react-router'

function SeriesChapter ({id, title, date}) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

    const style = {
       transition,
       transform: CSS.Transform.toString(transform)
    }

  return (
    <div key={id} ref={setNodeRef} {...attributes} {...listeners} style={style} className="chapter-card">

        <div className="chapter-info">
            <i className="fa-solid fa-bars"></i>
            <div>
                <span>{title}</span>
                <span className="chapter-date">{date}</span>
            </div>
        </div>
        <div className="chapter-control-icons">
            <i className="fa-solid fa-trash"></i>
            <NavLink to='/edit-chapter'><i className="fa-solid fa-pen-fancy"></i></NavLink>
        </div>

    </div>
  )
}

export default SeriesChapter