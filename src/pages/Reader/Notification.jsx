import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import "./reader.css";
import Pagination from "../../components/Pagination";
import { EmptyState, LoadingState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useSubscription } from "../../hooks/useSubscription";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import {
  subscribeNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../firebase/db";
import { timeAgo } from "../../lib/format";

const PER_PAGE = 10;

export default function Notification() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { run, busy } = useAsyncAction();

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: notifications, loading } = useSubscription(
    (cb) => subscribeNotifications(user?.uid, cb),
    [user?.uid],
    { initial: [] }
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    if (filter === "read") return notifications.filter((n) => n.read);
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, filter]);

  function handleFilter(next) {
    setFilter(next);
    setPage(1);
  }

  // Marking read happens on open, so the badge in the nav updates immediately.
  async function openNotification(notification) {
    if (!notification.read) {
      await run(() => markNotificationRead(user.uid, notification.id));
    }
    if (notification.link) navigate(notification.link);
  }

  async function handleMarkAll() {
    if (!unreadCount) return;
    const result = await run(() => markAllNotificationsRead(user.uid));
    if (result) toast.success(`Marked ${result} notification${result === 1 ? "" : "s"} as read.`);
  }

  if (loading) return <LoadingState label="Loading notifications…" />;

  return (
    <div className="notifacation">
      <div className="notif-cont">
        <div className="top">
          <p className="series">Notifications</p>

          <div className="btn-top" role="group" aria-label="Filter notifications">
            <button
              type="button"
              className={filter === "unread" ? "is-active unread" : "unread"}
              onClick={() => handleFilter("unread")}
              aria-pressed={filter === "unread"}
            >
              Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </button>
            <button
              type="button"
              className={filter === "read" ? "is-active read" : "read"}
              onClick={() => handleFilter("read")}
              aria-pressed={filter === "read"}
            >
              Read
            </button>
            <button
              type="button"
              className={filter === "all" ? "is-active" : ""}
              onClick={() => handleFilter("all")}
              aria-pressed={filter === "all"}
            >
              All
            </button>
          </div>

          <div className="btn-top">
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAll} disabled={busy}>
                Mark all read
              </button>
            )}
            <button type="button" onClick={() => navigate(-1)} aria-label="Close notifications">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="fa-bell"
            title={filter === "unread" ? "Nothing unread" : "No notifications yet"}
            message={
              filter === "unread"
                ? "You are all caught up."
                : "Follows, comments and new chapters on your series will show up here."
            }
            action={
              filter !== "all" ? (
                <button type="button" className="btn btn-gray" onClick={() => handleFilter("all")}>
                  Show all
                </button>
              ) : (
                <Link to="/search-discovery" className="btn btn-yellow">
                  Find something to read
                </Link>
              )
            }
          />
        ) : (
          <div className="notif-container">
            {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((notification) => (
              <button
                key={notification.id}
                type="button"
                className={`notif-item ${notification.read ? "" : "is-unread"}`}
                onClick={() => openNotification(notification)}
              >
                <p className="notif-name">
                  {notification.actorName && <strong>{notification.actorName}</strong>}{" "}
                  {notification.title}
                </p>
                {notification.message && <p className="message">{notification.message}</p>}
                <time className="muted">{timeAgo(notification.createdAt)}</time>
              </button>
            ))}
          </div>
        )}

        {filtered.length > PER_PAGE && (
          <div className="bottom">
            <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
