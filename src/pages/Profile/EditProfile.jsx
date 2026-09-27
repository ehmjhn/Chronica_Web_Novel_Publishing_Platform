import "./profile.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaFacebook, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { EmptyState, InlineMessage, LoadingState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useFilePreview } from "../../hooks/useForm";
import { updateUserProfile, uploadProfilePhoto } from "../../firebase/db";
import { displayNameOf } from "../../lib/format";
import { LIMITS, isBlank } from "../../lib/validation";

const FIELDS = [
  { name: "name", label: "Full Name", type: "text", maxLength: LIMITS.displayName },
  { name: "displayName", label: "Username", type: "text", maxLength: LIMITS.username },
  { name: "location", label: "Location", type: "text", maxLength: 80 },
  { name: "contactNo", label: "Contact No", type: "tel", maxLength: 25 },
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const SOCIALS = [
  { Icon: FaFacebook, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaTiktok, label: "TikTok" },
  { Icon: FaEnvelope, label: "Email" },
];

export default function EditProfile() {
  const { user, profile, loading } = useAuthUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { run, busy } = useAsyncAction();
  const { preview, file, error: fileError, select } = useFilePreview();

  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});

  // Seed the form once the profile arrives.
  useEffect(() => {
    if (profile) setDraft({ ...profile });
  }, [profile]);

  if (loading) return <LoadingState label="Loading your profile…" />;

  if (!user) {
    return (
      <EmptyState
        icon="fa-user"
        title="You are not signed in"
        message="Sign in to edit your profile."
        action={
          <Link to="/login" className="btn btn-yellow">
            Sign in
          </Link>
        }
      />
    );
  }

  if (!draft) return <LoadingState label="Preparing the editor…" />;

  const set = (name) => (event) => setDraft((d) => ({ ...d, [name]: event.target.value }));

  function validate() {
    const next = {};
    if (isBlank(draft.displayName)) next.displayName = "A username is required.";
    if ((draft.bio || "").length > LIMITS.bio) next.bio = `Keep the bio under ${LIMITS.bio} characters.`;
    if (draft.bdate && new Date(draft.bdate) > new Date())
      next.bdate = "Birthdate cannot be in the future.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const payload = { ...draft };
    if (file) {
      try {
        payload.profilePic = await uploadProfilePhoto(file);
      } catch (err) {
        toast.error(err.message);
        return;
      }
    }

    const result = await run(() => updateUserProfile(user.uid, payload), {
      success: "Profile updated.",
    });
    if (result !== false) navigate("/profile");
  }

  const name = displayNameOf(draft);
  const avatar = preview || draft.profilePic || user.photoURL || "";

  return (
    <div className="edit-profile-wrapper">
      <form className="edit-profile-card" onSubmit={handleSubmit} noValidate>
        <div className="edit-left">
          <div className="profile-image">
            <div className="image-circle">
              {avatar ? (
                <img src={avatar} alt={`${name}'s profile picture`} />
              ) : (
                <span className="image-circle__fallback" aria-hidden="true">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <h2>{name}</h2>
            {draft.displayName && <p>@{draft.displayName}</p>}
          </div>

          <div className="social-icons" aria-hidden="true">
            {SOCIALS.map(({ Icon, label }) => (
              <Icon key={label} title={label} />
            ))}
          </div>

          <div className="profile-nav">
            <label htmlFor="avatar-file" className="signout-btn upload-label">
              Change photo
            </label>
            <input
              id="avatar-file"
              className="visually-hidden-input"
              type="file"
              accept="image/*"
              onChange={(event) => select(event.target.files?.[0])}
            />
            {fileError && <InlineMessage tone="error">{fileError}</InlineMessage>}
            {file && <small className="muted">New photo will be uploaded on save.</small>}
          </div>
        </div>

        <div className="edit-right">
          <div className="edit-header">
            <h2>Edit Personal Information</h2>
          </div>

          <div className="edit-info">
            <label htmlFor="profile-bio">About Me</label>
            <textarea
              id="profile-bio"
              name="bio"
              rows={4}
              maxLength={LIMITS.bio}
              value={draft.bio || ""}
              onChange={set("bio")}
              placeholder="Tell readers about yourself…"
            />
            <small className="muted">
              {(draft.bio || "").length}/{LIMITS.bio}
            </small>
            {errors.bio && <InlineMessage tone="error">{errors.bio}</InlineMessage>}

            <label htmlFor="profile-joined">Date Joined</label>
            <input id="profile-joined" type="text" value={draft.joinedDate || "—"} readOnly disabled />

            {FIELDS.map(({ name: field, label, type, maxLength }) => (
              <div key={field}>
                <label htmlFor={`profile-${field}`}>{label}</label>
                <input
                  id={`profile-${field}`}
                  type={type}
                  name={field}
                  maxLength={maxLength}
                  value={draft[field] || ""}
                  onChange={set(field)}
                  aria-invalid={errors[field] ? "true" : undefined}
                />
                {errors[field] && <InlineMessage tone="error">{errors[field]}</InlineMessage>}
              </div>
            ))}

            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" type="email" name="email" value={draft.email || user.email || ""} readOnly disabled />

            <label htmlFor="profile-bdate">Birthdate</label>
            <input
              id="profile-bdate"
              type="date"
              name="bdate"
              value={draft.bdate || ""}
              onChange={set("bdate")}
              max={new Date().toISOString().slice(0, 10)}
              aria-invalid={errors.bdate ? "true" : undefined}
            />
            {errors.bdate && <InlineMessage tone="error">{errors.bdate}</InlineMessage>}

            <label htmlFor="profile-gender">Gender</label>
            <select id="profile-gender" name="gender" value={draft.gender || ""} onChange={set("gender")}>
              <option value="">Prefer not to say</option>
              {GENDERS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <div className="save-container">
              <Link to="/profile" className="cancel-btn">
                Cancel
              </Link>
              <button type="submit" className="save-btn" disabled={busy}>
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
