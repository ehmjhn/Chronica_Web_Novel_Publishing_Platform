# Chronica — Web Novel Publishing Platform

A web novel publishing and reading platform built with React and Firebase. Authors
create series, publish and reorder chapters, and grow an audience; readers
discover series, follow authors, bookmark, review, and get notified.

## Stack

| Concern | Choice |
| --- | --- |
| UI | React 19, JSX, plain CSS |
| Build | Vite (via `rolldown-vite`), `vite build` |
| Routing | React Router 7 (lazy routes, `BrowserRouter`) |
| Auth | Firebase Authentication (email/password + Google) |
| Data | Firebase Realtime Database (realtime subscriptions) |
| Uploads | Cloudinary unsigned preset (covers, profile photos) |
| Editor | Quill via `react-quill-new` |
| Drag & drop | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Sanitizing | DOMPurify (chapter HTML) |
| Icons | Font Awesome (CDN), `react-icons` |

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 7)
- A Firebase project with Authentication and Realtime Database enabled
- A Cloudinary account with an unsigned upload preset

## Setup

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
```

Fill in `.env`:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

`.env` is git-ignored. Vite only exposes `VITE_`-prefixed variables to the
client, so never place a private key or service-account credential here. Firebase
web config values are designed to be public — protect the data itself with
Firebase Security Rules.

The app fails fast with a clear message if these are missing, rather than
throwing a Firebase init error at the root.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole project |
| `node scripts/optimize-assets.mjs` | One-off raster → WebP conversion |

## Project layout

```
src/
  components/      Shared UI: StoryForm, ChapterEditor, Pagination, States,
                   PasswordField, toast context, nav/footer
  firebase/
    firebase-config.js  Env-driven Firebase + Cloudinary init (no secrets in code)
    auth.js             Email/password + Google auth, profile provisioning
    db.js               All Realtime Database access and subscriptions
  hooks/           useAuthUser, useSubscription, useAsyncData, useAsyncAction,
                   useStories, useChapters, useForm
  lib/             constants, format, validation, sanitize, search, selectors
  pages/           Home, Story, Chapter, Reader, Profile, Auth, Info, Error
  routes/          AppRouter, ProtectedRoute, GuestRoute, NavLayouts
```

### Data conventions (`src/firebase/db.js`)

- Every `subscribe*` function returns its unsubscribe handle. Call it from
  `useEffect` (or the `useSubscription` hook) so listeners are torn down.
- Counts use `update()` with the Firebase `increment()` sentinel, so concurrent
  writes cannot clobber each other. One-per-user view counting uses
  `runTransaction()`.
- Mutating calls throw so the UI can surface a real message; expected lookups
  return `null`/`[]`.
- Chapter writes verify series ownership (`assertSeriesOwner`) before writing.
- Id-collection fields (bookmarks, likes, followed authors) are normalised with
  `toIdSet`, because legacy records stored them as object maps instead of arrays.

### Security

- Author-supplied chapter HTML is only ever rendered through
  `sanitizeChapterHtml()` in `src/pages/Chapter/ReadChapter.jsx`.
- Profile edits are restricted to an allow-list
  (`EDITABLE_PROFILE_FIELDS`) so a stale form cannot reset counters or the
  user's liked/bookmarked lists.
- Route guards handle authentication; the database layer repeats the ownership
  check so a crafted request cannot bypass the UI.

## Features

**Reading**
- Home: featured, latest releases, popular works
- Search & Discovery: text search plus genre/tag/status/content-warning filters
  and sort by views, rating, favourites, or newest
- Series overview, chapter index, and a paginated reader with prev/next
- Bookmarks with search, per-page control, and one-click removal
- One review per account per series, editable, with star breakdown; review likes

**Authoring**
- Create/edit series with a shared form, multi-select genres and tags, and cover
  upload
- Rich-text chapter editor (add, edit, delete)
- Drag-to-reorder chapters; reordering is enabled only on the full ascending
  list so what you see always matches what you save
- My Series dashboard with pagination and cascade delete

**Account**
- Email/password registration with verification, Google sign-in
- Password reset, "set a password" flow for Google-only accounts
- Profile settings and editor, public author profiles, follow/unfollow
- Live notifications for new chapters, followers, and activity

## Deployment

```bash
npm run build
```

Serve `dist/` from any static host. Because the app uses `BrowserRouter`, the
host must rewrite unknown paths to `index.html`.

Set the `VITE_*` variables in the host's build environment (they are inlined at
build time — changing them requires a rebuild). Before going public:

1. Deploy Firebase Security Rules that validate ownership on `stories`,
   `chapters`, and `reviews`.
2. Restrict the Cloudinary upload preset to the expected file types and size.
3. Configure the authorised domains and sign-in providers in Firebase Auth.
4. Run a production build and smoke-test the main reader and author flows.

## Notes

- There is no automated test suite. Validation is `npm run lint`,
  `npm run build`, and manual smoke tests against a real Firebase project.
- `scripts/optimize-assets.mjs` converted the shipped raster assets to WebP
  (17.36 MB → 1.10 MB) and removed the originals. It skips files that are
  already WebP, so re-running is safe.
