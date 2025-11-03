import './story.css'
import { useState } from "react";
import { NavLink } from 'react-router';

function EditStory() {
  const genreOptions = [
    "Fantasy",
    "Romance",
    "Adventure",
    "Drama",
    "Sci-Fi",
    "Mystery",
    "Comedy",
    "Action",
  ];

  const tagOptions = [
    "Magic",
    "School Life",
    "Isekai",
    "Revenge",
    "Time Travel",
    "Villainess",
    "Slice of Life",
  ];

  const dummyStory = {
    coverImage: "https://via.placeholder.com/250x350.png?text=Story+Cover",
    title: "The Chronicles of Mythryl",
    synopsis:
      "In a world where ancient gods have fallen and magic runs wild, a young mage discovers a forgotten prophecy that could reshape the fate of kingdoms.",
    mainGenre: "Fantasy",
    status: "Ongoing",
    copyright: "All Rights Reserved",
    selectedGenres: ["Adventure", "Action", "Drama"],
    selectedTags: ["Magic", "Revenge", "Villainess"],
  };

  const [coverImage, setCoverImage] = useState(dummyStory.coverImage);
  const [title, setTitle] = useState(dummyStory.title);
  const [synopsis, setSynopsis] = useState(dummyStory.synopsis);
  const [mainGenre, setMainGenre] = useState(dummyStory.mainGenre);
  const [status, setStatus] = useState(dummyStory.status);
  const [copyright, setCopyright] = useState(dummyStory.copyright);
  const [selectedGenres, setSelectedGenres] = useState(dummyStory.selectedGenres);
  const [selectedTags, setSelectedTags] = useState(dummyStory.selectedTags);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCoverImage(event.target.result);
      reader.readAsDataURL(file);
    }
  }

  function handleAddGenre(value) {
    if (!value || selectedGenres.includes(value) || selectedGenres.length >= 7)
      return;
    setSelectedGenres([...selectedGenres, value]);
  }

  function handleRemoveGenre(value) {
    setSelectedGenres(selectedGenres.filter((genre) => genre !== value));
  }

  function handleAddTag(value) {
    if (!value || selectedTags.includes(value) || selectedTags.length >= 7)
      return;
    setSelectedTags([...selectedTags, value]);
  }

  function handleRemoveTag(value) {
    setSelectedTags(selectedTags.filter((tag) => tag !== value));
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
        <NavLink to='/my-series'>My Series</NavLink> / 
        <NavLink to='/update-story'>Update Story</NavLink> / 
      </div>
      <div className="create-form-page">
        <div className="series-chapter-link">
          <NavLink to='/update-story'>Series Details</NavLink>
          <NavLink to='/update-chapter-list'>Chapter List</NavLink>
        </div>

        <h2 className="create-form-title">Edit Story</h2>

        <form onSubmit={handleSubmit} className="create-form-container">
          <div className="create-form-section image-section">
            <label className="create-form-label">Image</label>
            <p className="create-form-note">
              250x350 pixels is recommended. NSFW or suggestive images are not allowed.
            </p>

            <div className="create-form-image-preview">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="create-form-cover"
                />
              ) : (
                <div className="create-form-placeholder">No Image</div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="create-form-file"
            />
          </div>

          <div className="create-form-section">
            <label className="create-form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="create-form-section">
            <label className="create-form-label">Synopsis</label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
            />
          </div>

          <div className="create-form-section create-form-flex">
            <div>
              <label className="create-form-label">Main Genre</label>
              <select
                value={mainGenre}
                onChange={(e) => setMainGenre(e.target.value)}
              >
                <option value="">Select</option>
                {genreOptions.map((genre, index) => (
                  <option key={index}>{genre}</option>
                ))}
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
              <select
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
              >
                <option>All Rights Reserved</option>
                <option>Public Domain</option>
                <option>Creative Commons</option>
              </select>
            </div>
          </div>

          <div className="create-form-section">
            <label className="create-form-label">Other Genres (max 7)</label>
            <select
              onChange={(e) => handleAddGenre(e.target.value)}
              value=""
              disabled={selectedGenres.length >= 7}
            >
              <option value="">Select</option>
              {genreOptions.map((genre, index) => (
                <option key={index}>{genre}</option>
              ))}
            </select>

            <div className="create-form-chip-list">
              {selectedGenres.map((genre, index) => (
                <span key={index} className="create-form-chip">
                  {genre}
                  <button
                    type="button"
                    className="create-form-remove-chip"
                    onClick={() => handleRemoveGenre(genre)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="create-form-section">
            <label className="create-form-label">Tags (max 7)</label>
            <select
              onChange={(e) => handleAddTag(e.target.value)}
              value=""
              disabled={selectedTags.length >= 7}
            >
              <option value="">Select</option>
              {tagOptions.map((tag, index) => (
                <option key={index}>{tag}</option>
              ))}
            </select>

            <div className="create-form-chip-list">
              {selectedTags.map((tag, index) => (
                <span key={index} className="create-form-chip">
                  {tag}
                  <button
                    type="button"
                    className="create-form-remove-chip"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="create-form-actions">
            <button type="submit" className="create-form-submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditStory