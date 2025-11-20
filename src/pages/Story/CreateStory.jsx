import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { insertStory, retrieveGenres, retrieveTags, uploadCoverImage } from "../../firebase/db";
import { subscribeAuthChanges } from "../../firebase/auth";

function CreateSeries() {
  const [user, setCurrentUser] = useState();
  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [contentWarning, setContentWarning] = useState("None");
  const [status, setStatus] = useState("Ongoing");
  const [copyright, setCopyright] = useState("All Rights Reserved");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((currentUser) => {
      setCurrentUser(currentUser);
    });

    retrieveGenres((data) => setGenreOptions(data));
    retrieveTags((data) => setTagOptions(data));

    return () => {
      unsubscribe();
    };
  }, []);

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

  function handleSubmit(e) {
    e.preventDefault();
    handleCreateSeries();
  }

  async function handleCreateSeries() {
  if (!title || !synopsis || !status || selectedGenres.length === 0 || selectedTags.length === 0 || !contentWarning || !copyright) {
    alert("Please fill all fields.");
    return;
  }

  let uploadedCoverUrl = coverImage;

  // If selected coverImage is a Base64 preview, upload it to Cloudinary
  if (coverImage && coverImage.startsWith("data:")) {
    const blob = await fetch(coverImage).then(res => res.blob());
    uploadedCoverUrl = await uploadCoverImage(blob);
  }

  insertStory(
    title,
    user?.uid,
    selectedGenres,
    status,
    synopsis,
    copyright,
    selectedTags,
    contentWarning,
    uploadedCoverUrl
  ).then((id) => {
    window.location.href = `/story-details/${id}`;
  });
}


  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
        <NavLink to='/my-series'>My Series</NavLink> /
        <NavLink to='/create-story'>Create your Story</NavLink>
      </div>

      <div className="create-form-page">
        <h2 className="create-form-title">Create Series</h2>

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

          <div className="create-form-section">
            <label className="create-form-label">Genres (max 7)</label>
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

          <div className="create-form-section create-form-flex">
            <div>
              <label className="create-form-label">Content Warning</label>
              <select value={contentWarning} onChange={(e) => setContentWarning(e.target.value)}>
                <option value="None">None</option>
                <option value="Gore">Gore</option>
                <option value="Sexual Content">Sexual Content</option>
                <option value="Strong Language">Strong Language</option>
              </select>
            </div>

            <div>
              <label className="create-form-label">Story Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
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
                <option value='All Rights Reserved'>All Rights Reserved</option>
                <option value='Public Domain'>Public Domain</option>
                <option value='Creative Commons'>Creative Commons</option>
              </select>
            </div>
          </div>

          <div className="create-form-actions">
            <button type="submit" className="create-form-submit" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSeries