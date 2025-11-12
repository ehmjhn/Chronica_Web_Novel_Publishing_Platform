import './chapter.css';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router';

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { addChapter, readComic, retrieveChapter } from '../../firebase/db';

function AddChapter() {
    // date time

    const { id } = useParams();
    const [story, setStory] = useState(0)
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    useEffect(() => {
        readComic((stories) => {
            const foundStory = stories.find(s => s.id === id);
            setStory(foundStory);
        })
    }, [])


    const [publishOption, setPublishOption] = useState('immediate');
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("")
    const [date, setDate] = useState(today);
    const [time, setTime] = useState(currentTime);
    async function handleAddChapter() {
        if (title === "" || content === "") { return alert("No missing fields.") }
        const key = await addChapter(id, content, title)

        window.location.href = `/read-chapter/${key}`;
    }
    return (
        <div className="page-background">
            <div className="subnav-control">
                <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
                <NavLink to='/my-series'>My Series</NavLink> /
                <NavLink to='/publish-chapter'>New Chapter</NavLink>
            </div>
            <div className="addchapter-container">
                {/* Header */}
                <div className="addchapter-header">
                    <h1>Create New Chapter</h1>
                    <hr />
                </div>

                {/* Series Info */}
                <div className="series-info">
                    <h2>Selected Series</h2>
                    <div className="series-card">
                        <div className="series-image">
                            <img src="" alt="Series cover" />
                        </div>
                        <div className="series-details">
                            <h3 className="series-title">{story.title}</h3>
                            <p className="series-genre">{story.genre?.map((g, i) => (
                                <span key={i} className="genre-tag">{g}</span>
                            ),)}</p>
                            <p className="series-description">
                                {story.synopsis}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chapter Form */}
                <div className="chapter-form">
                    <h2>New Chapter Details</h2>

                    <label htmlFor="chapter-title">Chapter Title</label>
                    <input id="chapter-title" type="text" onChange={(e) => setTitle(e.target.value)} placeholder="Enter chapter title..." />

                    <label htmlFor="chapter-content">Chapter Content</label>
                    <ReactQuill
                        className='chapter-content'
                        onChange={(e) => setContent(e)}
                        theme="snow"
                        placeholder="Write your chapter here..."
                    />

                    {/* Publish Options */}
                    <div className="publish-options">
                        <h3>Publish Options</h3>
                        <select
                            value={publishOption}
                            onChange={(e) => setPublishOption(e.target.value)}
                        >
                            <option value="immediate">Publish Immediately</option>
                            <option value="schedule">Schedule Publication</option>
                        </select>

                        {publishOption === 'schedule' && (
                            <div className="schedule-inputs">
                                <input
                                    type="date"
                                    className="schedule-date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="schedule-time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button className="save-btn" onClick={handleAddChapter}>Save Chapter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddChapter;
