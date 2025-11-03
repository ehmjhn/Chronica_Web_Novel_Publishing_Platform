import './chapter.css';
import { useState } from 'react';
import { NavLink } from 'react-router';

function AddChapter() {
    // date time
    const now = new Date();
    const today = now.toISOString().split('T')[0]; 
    const currentTime = now.toTimeString().slice(0, 5); 

    const [publishOption, setPublishOption] = useState('immediate');
    const [date, setDate] = useState(today);
    const [time, setTime] = useState(currentTime);

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
                            <h3 className="series-title">Series Title</h3>
                            <p className="series-genre">Genre: (Mapping here)</p>
                            <p className="series-description">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                Deserunt repellendus cum voluptates, provident itaque quod esse, 
                                in expedita recusandae fugiat saepe reprehenderit maiores sapiente 
                                illum, reiciendis suscipit accusamus? Quasi, necessitatibus.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chapter Form */}
                <div className="chapter-form">
                    <h2>New Chapter Details</h2>

                    <label htmlFor="chapter-title">Chapter Title</label>
                    <input id="chapter-title" type="text" placeholder="Enter chapter title..." />

                    <label htmlFor="chapter-content">Chapter Content</label>
                    <textarea id="chapter-content" placeholder="Write your chapter here..."></textarea>

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
                        <button className="save-btn">Save Chapter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddChapter;
