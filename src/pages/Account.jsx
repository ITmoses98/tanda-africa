import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

export default function Account() {
  const { isAuthenticated, user, logout } = useAuth();
  const { orders } = useAdmin();

  if (!isAuthenticated) return <Navigate to="/login" />;

  const userOrders = orders.filter(o => o.email === user.email);

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">
            <img src={user.avatar} alt={user.name} />
            <div>
              <h1>Welcome, {user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>
        </div>

        <div className="account-grid">
          <div className="account-card">
            <h3>📦 Recent Orders</h3>
            {userOrders.length > 0 ? (
              <div className="order-list">
                {userOrders.map(order => (
                  <div className="order-item" key={order.id}>
                    <div>
                      <strong>{order.id}</strong>
                      <p>{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                    </div>
                    <div className="order-right">
                      <span className="order-status">{order.status}</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders yet. <Link to="/catalog">Start shopping!</Link></p>
            )}
          </div>

          <div className="account-card">
            <h3>👤 Account Settings</h3>
            <div className="account-links">
              <Link to="/wishlist">My Wishlist</Link>
              <Link to="/cart">Shopping Cart</Link>
            </div>
            <hr />
            <button className="btn btn-secondary" onClick={logout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
