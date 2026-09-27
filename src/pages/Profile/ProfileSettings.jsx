import { Link } from "react-router";
import "./profile.css";
import { FaFacebook, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { LoadingState, EmptyState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { logout } from "../../firebase/auth";
import { displayNameOf, formatDate, formatNumber } from "../../lib/format";

const SOCIALS = [
  { Icon: FaFacebook, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaTiktok, label: "TikTok" },
  { Icon: FaEnvelope, label: "Email" },
];

export default function ProfileSettings() {
  const { user, profile, loading } = useAuthUser();
  const toast = useToast();
  const { run, busy } = useAsyncAction();

  async function handleLogout() {
    const result = await run(() => logout());
    if (result !== false) toast.info("Signed out.");
  }

  if (loading) return <LoadingState label="Loading your profile…" />;

  if (!user) {
    return (
      <EmptyState
        icon="fa-user"
        title="You are not signed in"
        message="Sign in to view your profile."
        action={
          <Link to="/login" className="btn btn-yellow">
            Sign in
          </Link>
        }
      />
    );
  }

  const display = profile || {};
  const name = displayNameOf(display);
  const avatar = display.profilePic || user.photoURL || "";

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-left">
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
            {display.displayName && <p>@{display.displayName}</p>}
            <p>
              Following: {formatNumber(display.followingCount)} | Followers:{" "}
              {formatNumber(display.followersCount)}
            </p>
            {display.totalSeries > 0 && <p>{display.totalSeries} published series</p>}
          </div>

          <div className="social-icons" aria-hidden="true">
            {SOCIALS.map(({ Icon, label }) => (
              <Icon key={label} title={label} />
            ))}
          </div>

          <div className="profile-nav">
            <button type="button" className="signout-btn" onClick={handleLogout} disabled={busy}>
              {busy ? "Signing out…" : "Log Out"}
            </button>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-header">
            <h2>Personal Information</h2>
          </div>

          <div className="profile-info">
            <label>About Me</label>
            {display.bio ? (
              <p className="profile-bio">{display.bio}</p>
            ) : (
              <p className="muted">You have not written a bio yet.</p>
            )}

            <label>Joined</label>
            <p className="profile-value">{display.joinedDate ? formatDate(display.joinedDate) : "—"}</p>

            <label>Full Name</label>
            <p className="profile-value">{display.name || "—"}</p>

            <label>Username</label>
            <p className="profile-value">{display.displayName || "—"}</p>

            <label>Email</label>
            <p className="profile-value">{display.email || user.email || "—"}</p>

            <label>Contact No</label>
            <p className="profile-value">{display.contactNo || "—"}</p>

            <label>Birthdate</label>
            <p className="profile-value">{display.bdate ? formatDate(display.bdate) : "—"}</p>

            <label>Gender</label>
            <p className="profile-value">{display.gender || "—"}</p>

            <label>Location</label>
            <p className="profile-value">{display.location || "—"}</p>

            <div className="edit-btn-container">
              <Link to="/edit-profile" className="edit-btn">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
