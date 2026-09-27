import { useState } from "react";
import { Link } from "react-router";
import "./info.css";

const SECTIONS = [
  {
    id: "account",
    title: "Account & sign-in",
    icon: "fa-solid fa-user",
    items: [
      {
        q: "How do I create an account?",
        a: "Choose Register, fill in your name, username, email and a password, then confirm your email address using the link we send you. You can verify through Google instead by picking “Continue with Google” on the sign-in page.",
      },
      {
        q: "I did not get the verification email.",
        a: "Check your spam folder first. On the sign-in page, enter your email and password, and a “Resend verification email” button appears once you are signed in. Publishing stays locked until the address is confirmed.",
      },
      {
        q: "I signed in with Google. How do I use a password too?",
        a: "We send you to “Set your password” the first time you arrive with a Google-only account. Pick a password there and you can sign in either way from then on.",
      },
      {
        q: "How do I reset a forgotten password?",
        a: "Use “Forgot Password?” on the sign-in page. We email a reset link that stays valid for one hour.",
      },
    ],
  },
  {
    id: "publishing",
    title: "Publishing a series",
    icon: "fa-solid fa-feather-pointed",
    items: [
      {
        q: "How do I start a series?",
        a: "Go to My Series and choose “Add series”. Fill in the title and synopsis, pick up to seven genres and seven tags, set the status and content warning, then upload a cover image (250×350 is recommended) and publish.",
      },
      {
        q: "How do I add and reorder chapters?",
        a: "Open a series and choose “Add chapter”, write it in the editor, and publish. To rearrange, open “Chapters”, drag a chapter by its grip handle, then press “Save Changes”. Reordering is only available on the full ascending list so what you see always matches what you save.",
      },
      {
        q: "Does editing a chapter overwrite my published version?",
        a: "Yes — the editor always saves the text currently on screen. Chapter order and your series details are stored separately, so editing a chapter never renumbers anything.",
      },
      {
        q: "Can I delete a series?",
        a: "Yes, from My Series. Deleting removes the series together with all of its chapters and reviews, and cannot be undone.",
      },
    ],
  },
  {
    id: "reading",
    title: "Reading & discovery",
    icon: "fa-solid fa-book-open",
    items: [
      {
        q: "How do I find something to read?",
        a: "Use Search & Discovery. Search by title, synopsis, author, genre or tag, then filter by genre, tag, content warning and status, and sort by views, rating, favourites or newest.",
      },
      {
        q: "What is the difference between a view and a favourite?",
        a: "A view is counted once per account per series, and never for the author’s own series. A favourite is the heart button on a series page and can be toggled as often as you like.",
      },
      {
        q: "How do I build a reading list?",
        a: "Press “Bookmark” on any series. Everything you save collects on the Bookmarks page, where you can search it, remove entries, and jump straight back in.",
      },
      {
        q: "How are ratings and reviews handled?",
        a: "Reviews are one per account per series and can be edited at any time. The star breakdown under the total reflects the average of published reviews.",
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications & following",
    icon: "fa-solid fa-bell",
    items: [
      {
        q: "Where do notifications come from?",
        a: "New chapters on series you follow, new followers, and activity on your own series. Open the bell in the navigation bar to read, filter by read or unread, and mark everything as read.",
      },
      {
        q: "What happens when I follow an author?",
        a: "You can find them from any series overview and see their public profile, which lists their published work. You can unfollow at any time.",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: "fa-solid fa-triangle-exclamation",
    items: [
      {
        q: "My cover image did not upload.",
        a: "Cover images go through Cloudinary and must be under 5 MB in a common image format. If the upload fails, the form keeps everything you typed so you can retry without retyping.",
      },
      {
        q: "A page says “not found” for a series I just created.",
        a: "Series appear as soon as they are published. If you reached the page from an old bookmark, it may have been deleted — try Search & Discovery for the current catalogue.",
      },
      {
        q: "The page looks unstyled or blank.",
        a: "A hard refresh usually clears a stale cached bundle. If it persists, clear site data for this domain and reload.",
      },
    ],
  },
];

export default function Help() {
  const [open, setOpen] = useState(null);

  return (
    <div className="help-page">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <span>Help</span>
      </div>

      <header className="help-hero">
        <h1>How can we help?</h1>
        <p>
          Answers about accounts, publishing, and reading. Still stuck?{" "}
          <Link to="/about-us">Learn more about Chronica</Link>.
        </p>
      </header>

      <nav className="help-jump" aria-label="Help sections">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            <i className={`${section.icon}`} aria-hidden="true" /> {section.title}
          </a>
        ))}
      </nav>

      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="help-section">
          <h2>
            <i className={section.icon} aria-hidden="true" /> {section.title}
          </h2>

          <ul className="help-list">
            {section.items.map((item) => {
              const isOpen = open === `${section.id}:${item.q}`;
              return (
                <li key={item.q} className={`help-item ${isOpen ? "is-open" : ""}`}>
                  <button
                    type="button"
                    className="help-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : `${section.id}:${item.q}`)}
                  >
                    <span>{item.q}</span>
                    <i
                      className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && <p className="help-answer">{item.a}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
