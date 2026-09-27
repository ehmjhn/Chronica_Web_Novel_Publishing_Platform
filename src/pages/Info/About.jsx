import { Link } from "react-router";
import "./info.css";
import Mythryl from "../../assets/Mythryl.webp";

/**
 * The three cards used id="description" three times, which is invalid HTML and
 * meant the CSS applied to a single element. They are classes now.
 */
const CARDS = [
  {
    key: "guidelines",
    title: "Publishing Guidelines",
    icon: "fa-book",
    body: "Discover Chronica's publishing standards designed to help creators share their stories responsibly and beautifully. Learn how to format your work, follow community rules, and make sure every story reaches readers the right way.",
    to: "/help#publishing",
    cta: "Read the guidelines",
  },
  {
    key: "create",
    title: "Create your Story",
    icon: "fa-pencil",
    body: "Bring your ideas to life with Chronica's easy-to-use tools. Write, edit, and organize your stories and chapters all in one place — helping you focus on creativity while keeping everything neatly managed.",
    to: "/create-story",
    cta: "Start writing",
  },
  {
    key: "share",
    title: "Share and Grow",
    icon: "fa-globe",
    body: "Share your stories with the world and connect with readers who love your work. Chronica makes it simple to distribute your content, track engagement, and grow your creative presence.",
    to: "/search-discovery",
    cta: "Browse stories",
  },
];

export default function About() {
  return (
    <div className="about-wrap">
      <div className="about-cont">
        <div className="About-us">
          <h1>
            About <span>Us</span>
          </h1>
          <hr />
        </div>

        <div className="who-we-are">
          <div className="text-side">
            <h2>
              Who we <span>Are</span>
            </h2>
            <hr />
            <p>
              Chronica is a creative content management and distribution system for authors,
              creators, and publishers. Streamline your storytelling, track readership, and
              distribute content seamlessly.
            </p>
            <ul className="about-list">
              <li>Manage and organize your stories</li>
              <li>Track chapter updates and analytics</li>
              <li>Engage with your audience</li>
              <li>Distribute content across multiple platforms</li>
            </ul>

            <div className="how-we-started">
              <h2>
                How we <span>Started</span>
              </h2>
              <hr />
              <p>
                Chronica started as a simple idea to help creators manage and share their stories
                more easily. We saw how hard it was for authors to track updates, connect with
                readers, and distribute content across platforms. So we built Chronica — a
                creative system that streamlines storytelling, organizes content, and empowers
                creators to focus on what they do best: telling great stories.
              </p>
            </div>
          </div>

          <div className="image-side">
            <img src={Mythryl} alt="Chronica logo" />
          </div>
        </div>

        <div className="our-mission">
          <h2>
            Our <span>Mission</span>
          </h2>
          <p>
            Our mission is to empower authors, creators, and publishers by providing a simple and
            smart platform to manage stories, track readership, and share content effortlessly.
            Chronica aims to make storytelling easier, more organized, and more connected for
            everyone.
          </p>
        </div>

        <div className="pang-yabang">
          <div>
            <h3>Serials</h3>
            <p>Read or publish at your own pace</p>
          </div>

          <div>
            <h3>Rich text</h3>
            <p>Format chapters with a full editor</p>
          </div>

          <div>
            <h3>Live</h3>
            <p>
              Innovation in
              <br />
              digital publishing
            </p>
          </div>

          <div>
            <h3>
              Chismis
              <br />
              2025
            </h3>
            <p>Recognised at Chismis 2025</p>
          </div>
        </div>

        <hr className="line" />

        <div className="get-started">
          <h2>
            Get Started <span>and Grow</span>
          </h2>
        </div>

        <div className="Cards">
          {CARDS.map((card) => (
            <div className="card-container" key={card.key}>
              <h3>{card.title}</h3>
              <i id={`icon-${card.key}`} className={`fa-solid ${card.icon}`} aria-hidden="true" />
              <p className="description">{card.body}</p>
              <p>
                <Link to={card.to} className="card-link">
                  {card.cta}
                </Link>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
