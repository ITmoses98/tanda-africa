import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

const sidebarItems = [
  { section: "Main", items: [
    { path: "/dashboard", label: "Dashboard Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/dashboard/profile", label: "My Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { path: "/dashboard/orders", label: "My Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { path: "/dashboard/wishlist", label: "My Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  ]},
  { section: "Shopping", items: [
    { path: "/dashboard/cart", label: "Shopping Cart", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
    { path: "/dashboard/library", label: "Book Library", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { path: "/dashboard/coupons", label: "Coupons & Promos", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" },
  ]},
  { section: "Community", items: [
    { path: "/dashboard/reviews", label: "My Reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
    { path: "/dashboard/recommendations", label: "Recommendations", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
    { path: "/dashboard/notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { path: "/dashboard/messages", label: "Messages & Support", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  ]},
  { section: "Account", items: [
    { path: "/dashboard/loyalty", label: "Loyalty & Rewards", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/dashboard/payments", label: "Payment Methods", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { path: "/dashboard/security", label: "Account Security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { path: "/dashboard/preferences", label: "Reading Preferences", icon: "M4 6h16M4 12h16M4 18h16" },
    { path: "/dashboard/history", label: "Search History", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { path: "/dashboard/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ]},
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { unreadCount, loyaltyPoints, membershipLevel, membershipColors } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard" ? "active" : "";
    return location.pathname.startsWith(path) ? "active" : "";
  };

  return (
    <div className="dash-layout">
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dash-sidebar-header">
          <Link to="/dashboard" className="dash-logo">
            <span className="dash-logo-icon">T</span>
            <span>My Dashboard</span>
          </Link>
        </div>
        <nav className="dash-sidebar-nav">
          {sidebarItems.map(group => (
            <div key={group.section}>
              <div className="dash-nav-section">{group.section}</div>
              {group.items.map(item => (
                <Link key={item.path} to={item.path} className={`dash-nav-item ${isActive(item.path)}`} onClick={() => setSidebarOpen(false)}>
                  <span className="dash-nav-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </span>
                  <span>{item.label}</span>
                  {item.path === "/dashboard/notifications" && unreadCount > 0 && (
                    <span className="dash-badge">{unreadCount}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="dash-sidebar-footer">
          <div className="dash-sidebar-user">
            <img src={user?.avatar} alt="" className="dash-avatar" />
            <div>
              <span className="dash-user-name">{user?.name}</span>
              <span className="dash-user-tier" style={{ color: membershipColors[membershipLevel] }}>{membershipLevel} Member</span>
            </div>
          </div>
          <div className="dash-sidebar-pts">{loyaltyPoints} pts</div>
        </div>
      </aside>

      <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />

      <div className="dash-content">
        <header className="dash-content-header">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="dash-breadcrumb">Dashboard / <span>{location.pathname.split("/").pop() || "Home"}</span></div>
          <div className="dash-header-right">
            <Link to="/" className="dash-store-btn">← Store</Link>
            <button onClick={logout} className="dash-logout-btn">Sign Out</button>
          </div>
        </header>
        <div className="dash-content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
