import { useDashboard } from "../../context/DashboardContext";

const icons = { order: "📦", shipping: "🚚", promo: "🏷️", wishlist: "❤️", arrival: "📚" };

export default function DashboardNotifications() {
  const { notifications, markRead, markAllRead } = useDashboard();

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1>Notifications</h1>
          <p className="dash-sub">{notifications.filter(n => !n.read).length} unread</p>
        </div>
        <button className="dash-btn sm" onClick={markAllRead}>Mark All Read</button>
      </div>

      <div className="dash-notif-list">
        {notifications.map(n => (
          <div key={n.id} className={`dash-notif-item ${!n.read ? "unread" : ""}`} onClick={() => markRead(n.id)}>
            <span className="dash-notif-icon">{icons[n.type] || "🔔"}</span>
            <div className="dash-notif-body">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <span className="dash-notif-date">{n.date}</span>
            </div>
            {!n.read && <span className="dash-notif-dot" />}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="dash-empty"><h3>No notifications</h3></div>
        )}
      </div>
    </div>
  );
}
