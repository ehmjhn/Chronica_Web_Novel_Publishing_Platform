import './chapter.css';
import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { retrieveChapter, updateChapter } from '../../firebase/db';

function EditChapter() {
    const { id } = useParams();

    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = retrieveChapter((chapters) => {
            const chap = chapters.find(ch => ch.id === id);
            if (chap) {

                if (chap.publishStatus === 'scheduled') {
                    const publishDate = new Date(chap.publishDate);
                    chap.date = publishDate.toISOString().split('T')[0];
                    chap.time = publishDate.toTimeString().slice(0, 5);
                    chap.publishOption = 'schedule';
                } else {
                    chap.publishOption = 'immediate';
                }
                setChapter(chap);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    const handleUpdateChapter = async () => {
        try {
            const publishDate = chapter.publishOption === 'schedule'
                ? new Date(`${chapter.date}T${chapter.time}`)
                : new Date();

            await updateChapter(id, {
                chapterTitle: chapter.chapterTitle,
                content: chapter.content,
                publishStatus: chapter.publishOption === 'schedule' ? 'scheduled' : 'published',
                publishDate: publishDate.toISOString()
            });

            alert('Chapter updated successfully!');
            window.location.href = `/update-chapter-list/${chapter.storyId}`;
        } catch (error) {
            console.error(error);
            alert('Failed to update chapter');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!chapter) return <p>Chapter not found</p>;

    return (
        <div className="page-background">
            <div className="subnav-control">
                <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
                <NavLink to='/my-series'>My Series</NavLink> /
                <NavLink to={`/update-chapter-list/${chapter.storyId}`}>Update Chapters</NavLink> /
                <NavLink to={`/edit-chapter/${id}`}>Edit Chapter</NavLink>
            </div>

            <div className="addchapter-container">
                <div className="addchapter-header">
                    <h1>Edit Chapter</h1>
                    <hr />
                </div>

                {chapter.series && (
                    <div className="series-info">
                        <h2>Selected Series</h2>
                        <div className="series-card">
                            <div className="series-image">
                                <img src={chapter.series.cover || "https://via.placeholder.com/250x350"} alt="Series cover" />
                            </div>
                            <div className="series-details">
                                <h3 className="series-title">{chapter.series.title}</h3>
                                <p className="series-genre">Genre: {chapter.series.genre}</p>
                                <p className="series-description">{chapter.series.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="chapter-form">
                    <h2>Edit Chapter Details</h2>

                    <label htmlFor="chapter-title">Chapter Title</label>
                    <input
                        id="chapter-title"
                        type="text"
                        value={chapter.chapterTitle || ''}
                        onChange={(e) => setChapter({ ...chapter, chapterTitle: e.target.value })}
                    />

                    <label htmlFor="chapter-content">Chapter Content</label>
                    <ReactQuill
                        className="chapter-content"
                        value={chapter.content || ''}
                        onChange={(value) => setChapter({ ...chapter, content: value })}
                        theme="snow"
                        placeholder="Write your chapter here..."
                    />

                    <div className="publish-options">
                        <h3>Publish Options</h3>
                        <select
                            value={chapter.publishOption}
                            onChange={(e) => setChapter({ ...chapter, publishOption: e.target.value })}
                        >
                            <option value="immediate">Publish Immediately</option>
                            {/* <option value="schedule">Schedule Publication</option> */}
                        </select>

                        {chapter.publishOption === 'schedule' && (
                            <div className="schedule-inputs">
                                <input
                                    type="date"
                                    className="schedule-date"
                                    value={chapter.date || ''}
                                    onChange={(e) => setChapter({ ...chapter, date: e.target.value })}
                                />
                                <input
                                    type="time"
                                    className="schedule-time"
                                    value={chapter.time || ''}
                                    onChange={(e) => setChapter({ ...chapter, time: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button className="save-btn" onClick={handleUpdateChapter}>Update Chapter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditChapter;
