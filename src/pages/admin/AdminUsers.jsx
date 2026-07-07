import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const sampleUsers = [
  { id: 1, name: "Admin", email: "admin@tandaafrica.com", role: "Admin", joined: "2024-01-01", orders: 0, status: "Active", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
  { id: 2, name: "John Doe", email: "john@example.com", role: "Customer", joined: "2024-03-15", orders: 2, status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  { id: 3, name: "Jane Smith", email: "jane@example.com", role: "Customer", joined: "2024-04-20", orders: 5, status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: 4, name: "Amina Okafor", email: "amina@example.com", role: "Customer", joined: "2024-05-10", orders: 3, status: "Active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
  { id: 5, name: "David Kamau", email: "david@example.com", role: "Seller", joined: "2024-06-01", orders: 0, status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
  { id: 6, name: "Grace Mensah", email: "grace@example.com", role: "Customer", joined: "2024-07-22", orders: 1, status: "Suspended", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" },
];

const roles = ["Customer", "Seller", "Admin"];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(sampleUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (id, newRole) => {
    if (id === 1) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleToggleStatus = (id) => {
    if (id === 1) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));
  };

  const adminUser = users.find(u => u.email === currentUser?.email);

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Users</h1>
          <p className="page-sub">{users.length} registered users</p>
        </div>
      </div>

      <div className="adm-search">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="adm-empty">
                    <div className="empty-icon">👥</div>
                    <h3>No users found</h3>
                    <p>Try a different search</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(user => {
              const isSelf = currentUser?.email === user.email || adminUser?.id === user.id;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="td-user">
                      <img src={user.avatar} alt={user.name} />
                      <div>
                        <strong>{user.name} {isSelf ? <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 600 }}>(You)</span> : ""}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {isSelf ? (
                      <span className={`adm-badge ${user.role === "Admin" ? "purple" : user.role === "Seller" ? "green" : "blue"}`}>{user.role}</span>
                    ) : (
                      <select
                        className="adm-status-select"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    )}
                  </td>
                  <td style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{user.joined}</td>
                  <td style={{ fontWeight: 600, color: "rgba(255,255,255,.7)" }}>{user.orders}</td>
                  <td>
                    <span className={`adm-status`}>
                      <span className={`dot ${user.status === "Active" ? "green" : "red"}`} />
                      {user.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="adm-table-actions" style={{ justifyContent: "flex-end" }}>
                      {!isSelf && (
                        <button
                          className={`adm-btn-sm ${user.status === "Active" ? "danger" : ""}`}
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === "Active" ? "Suspend" : "Activate"}
                        >
                          {user.status === "Active" ? "⛔" : "✅"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
