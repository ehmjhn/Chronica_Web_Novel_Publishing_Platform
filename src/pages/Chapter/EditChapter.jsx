import './chapter.css';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

function EditChapter() {
    // mock data
    const mockChapter = {
        id: 'ch-001',
        title: 'The Beginning of the End',
        content: `The sun dipped below the horizon as the hero finally understood his destiny. 
                  Shadows whispered secrets of old battles...`,
        series: {
            title: 'Echoes of Eternity',
            genre: 'Fantasy, Action',
            cover: 'https://via.placeholder.com/250x350?text=Series+Cover',
            description: 'A story of light and darkness clashing for the fate of the world.'
        },
        publishOption: 'schedule',
        date: '2025-11-04',
        time: '15:30'
    };

    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterContent, setChapterContent] = useState('');
    const [publishOption, setPublishOption] = useState('immediate');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        // Load mock data (simulate fetching existing chapter)
        setChapterTitle(mockChapter.title);
        setChapterContent(mockChapter.content);
        setPublishOption(mockChapter.publishOption);
        setDate(mockChapter.date);
        setTime(mockChapter.time);
    }, []);

    return (
        <div className="page-background">
            <div className="subnav-control">
                <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> / 
                <NavLink to='/my-series'>My Series</NavLink> /
                <NavLink to='/update-chapter-list'>Update Chapters</NavLink> /
                <NavLink to='/edit-chapter'>Edit Chapter</NavLink> 
            </div>

            <div className="addchapter-container">
                {/* Header */}
                <div className="addchapter-header">
                    <h1>Edit Chapter</h1>
                    <hr />
                </div>

                {/* Series Info */}
                <div className="series-info">
                    <h2>Selected Series</h2>
                    <div className="series-card">
                        <div className="series-image">
                            <img src={mockChapter.series.cover} alt="Series cover" />
                        </div>
                        <div className="series-details">
                            <h3 className="series-title">{mockChapter.series.title}</h3>
                            <p className="series-genre">Genre: {mockChapter.series.genre}</p>
                            <p className="series-description">{mockChapter.series.description}</p>
                        </div>
                    </div>
                </div>

                {/* Chapter Form */}
                <div className="chapter-form">
                    <h2>Edit Chapter Details</h2>

                    <label htmlFor="chapter-title">Chapter Title</label>
                    <input
                        id="chapter-title"
                        type="text"
                        value={chapterTitle}
                        onChange={(e) => setChapterTitle(e.target.value)}
                    />

                    <label htmlFor="chapter-content">Chapter Content</label>
                    <textarea
                        id="chapter-content"
                        value={chapterContent}
                        onChange={(e) => setChapterContent(e.target.value)}
                    ></textarea>

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
                        <button className="save-btn">Update Chapter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditChapter;
