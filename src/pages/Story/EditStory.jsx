import './story.css'
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from 'react-router';
import { getUserStories, updateStory, uploadCoverImage } from '../../firebase/db.js';
import { subscribeAuthChanges } from '../../firebase/auth.js';

function EditStory() {
  const genreOptions = [
    "Fantasy", "Romance", "Adventure", "Drama", "Sci-Fi", "Mystery", "Comedy", "Action",
  ];

  const tagOptions = [
    "Magic", "School Life", "Isekai", "Revenge", "Time Travel", "Villainess", "Slice of Life",
  ];

  const { id } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [storyId, setStoryId] = useState(id);
  const [coverImage, setCoverImage] = useState("");
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [contentWarning, setContentWarning] = useState("");
  const [status, setStatus] = useState("");
  const [copyright, setCopyright] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((user) => {
      if (user) {
        setCurrentUserId(user.uid);
        getUserStories(user.uid, (stories) => {

          const myStory = stories.find(story => story.id === id);
          if (myStory) {
            setStoryId(myStory.id);
            setCoverImage(myStory.coverImage || "");
            setTitle(myStory.title || "");
            setSynopsis(myStory.synopsis || "");
            setContentWarning(myStory.contentWarning || "");
            setStatus(myStory.status || "");
            setCopyright(myStory.copyright || "");
            setSelectedGenres(myStory.genre || []);
            setSelectedTags(myStory.tags || []);
          } else {
            alert("Story not found or you are not the author.");
            navigate("/my-series");
          }
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCoverImage(event.target.result);
      reader.readAsDataURL(file);
    }
  }

  function handleAddGenre(value) {
    if (!value || selectedGenres.includes(value) || selectedGenres.length >= 7) return;
    setSelectedGenres([...selectedGenres, value]);
  }

  function handleRemoveGenre(value) {
    setSelectedGenres(selectedGenres.filter((genre) => genre !== value));
  }

  function handleAddTag(value) {
    if (!value || selectedTags.includes(value) || selectedTags.length >= 7) return;
    setSelectedTags([...selectedTags, value]);
  }

  function handleRemoveTag(value) {
    setSelectedTags(selectedTags.filter((tag) => tag !== value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!storyId || !currentUserId) return;

    let uploadedCoverUrl = coverImage;

    if (coverImage && coverImage.startsWith("data:")) {
      const blob = await fetch(coverImage).then(res => res.blob());
      uploadedCoverUrl = await uploadCoverImage(blob);
    }

    if (!title || !synopsis || !status || selectedGenres.length === 0 || selectedTags.length === 0 || !contentWarning || !copyright) {
      alert("Please fill all fields.");
      return;
    }
    await updateStory(
      storyId,
      title,
      currentUserId,
      selectedGenres,
      status,
      synopsis,
      copyright,
      selectedTags,
      contentWarning,
      uploadedCoverUrl
    );

    alert("Story updated successfully!");
    navigate("/my-series");
  }

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
        <NavLink to='/my-series'>My Series</NavLink> /
        <NavLink to={`/update-story/${storyId}`}>Update Story</NavLink> /
      </div>
      <div className="create-form-page">
        <div className="series-chapter-link">
          <NavLink to={`/update-story/${storyId}`}>Series Details</NavLink>
          <NavLink to={`/update-chapter-list/${storyId}`}>Chapter List</NavLink>
        </div>

        <h2 className="create-form-title">Edit Story</h2>

        <form onSubmit={handleSubmit} className="create-form-container">
          {/* Image Section */}
          <div className="create-form-section image-section">
            <label className="create-form-label">Image</label>
            <p className="create-form-note">
              250x350 pixels is recommended. NSFW or suggestive images are not allowed.
            </p>

            <div className="create-form-image-preview">
              {coverImage ? (
                <img src={coverImage} alt="Cover Preview" className="create-form-cover" />
              ) : (
                <div className="create-form-placeholder">No Image</div>
              )}
            </div>

            <input type="file" accept="image/*" onChange={handleImageChange} className="create-form-file" />
          </div>

          {/* Title & Synopsis */}
          <div className="create-form-section">
            <label className="create-form-label">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="create-form-section">
            <label className="create-form-label">Synopsis</label>
            <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
          </div>

          {/* Genres */}
          <div className="create-form-section">
            <label className="create-form-label">Genres (max 7)</label>
            <select onChange={(e) => handleAddGenre(e.target.value)} value="" disabled={selectedGenres.length >= 7}>
              <option value="">Select</option>
              {genreOptions.map((genre, index) => (<option key={index}>{genre}</option>))}
            </select>

            <div className="create-form-chip-list">
              {Object.values(selectedGenres || {}).map((genre, index) => (
                <span key={index} className="create-form-chip">
                  {genre}
                  <button type="button" className="create-form-remove-chip" onClick={() => handleRemoveGenre(genre)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="create-form-section">
            <label className="create-form-label">Tags (max 7)</label>
            <select onChange={(e) => handleAddTag(e.target.value)} value="" disabled={selectedTags.length >= 7}>
              <option value="">Select</option>
              {tagOptions.map((tag, index) => (<option key={index}>{tag}</option>))}
            </select>

            <div className="create-form-chip-list">
              {Object.values(selectedTags || {}).map((tag, index) => (
                <span key={index} className="create-form-chip">
                  {tag}
                  <button type="button" className="create-form-remove-chip" onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Content Warning, Status, Copyright */}
          <div className="create-form-section create-form-flex">
            <div>
              <label className="create-form-label">Content Warning</label>
              <select value={contentWarning} onChange={(e) => setContentWarning(e.target.value)}>
                <option value="">Select</option>
                <option value="Gore">Gore</option>
                <option value="Sexual Content">Sexual Content</option>
                <option value="Strong Language">Strong Language</option>
              </select>
            </div>

            <div>
              <label className="create-form-label">Story Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>Hiatus</option>
              </select>
            </div>

            <div>
              <label className="create-form-label">Copyright</label>
              <select value={copyright} onChange={(e) => setCopyright(e.target.value)}>
                <option>All Rights Reserved</option>
                <option>Public Domain</option>
                <option>Creative Commons</option>
              </select>
            </div>
          </div>

          <div className="create-form-actions">
            <button type="submit" className="create-form-submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStory;
