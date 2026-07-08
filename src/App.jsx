import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Seller from "./pages/Seller";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminShipping from "./pages/admin/AdminShipping";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardProfile from "./pages/dashboard/DashboardProfile";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardLibrary from "./pages/dashboard/DashboardLibrary";
import DashboardLoyalty from "./pages/dashboard/DashboardLoyalty";
import DashboardReviews from "./pages/dashboard/DashboardReviews";
import DashboardNotifications from "./pages/dashboard/DashboardNotifications";
import DashboardRecommendations from "./pages/dashboard/DashboardRecommendations";

function AdminGuard({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  const loc = useLocation();
  if (!isAuthenticated) return <Navigate to={`/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`} />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/login" element={<Layout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/register" element={<Layout />}>
        <Route index element={<Register />} />
      </Route>
      <Route element={<AuthGuard><Layout /></AuthGuard>}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Account />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<AdminBooks />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/sellers" element={<AdminSellers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/coupons" element={<AdminCoupons />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/shipping" element={<AdminShipping />} />
      </Route>

      <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/orders" element={<DashboardOrders />} />
        <Route path="/dashboard/wishlist" element={<Wishlist />} />
        <Route path="/dashboard/cart" element={<Cart />} />
        <Route path="/dashboard/library" element={<DashboardLibrary />} />
        <Route path="/dashboard/coupons" element={<div className="dash-page"><div className="dash-header"><h1>Coupons & Promos</h1><p className="dash-sub">Your available discounts</p></div><div className="dash-empty"><span style={{fontSize:40}}>🏷️</span><h3>No coupons yet</h3><p>Coupons you earn will appear here.</p></div></div>} />
        <Route path="/dashboard/reviews" element={<DashboardReviews />} />
        <Route path="/dashboard/recommendations" element={<DashboardRecommendations />} />
        <Route path="/dashboard/notifications" element={<DashboardNotifications />} />
        <Route path="/dashboard/messages" element={<div className="dash-page"><div className="dash-header"><h1>Messages & Support</h1><p className="dash-sub">Your conversation history</p></div><div className="dash-empty"><span style={{fontSize:40}}>💬</span><h3>No messages yet</h3><p>Contact support to start a conversation.</p></div></div>} />
        <Route path="/dashboard/loyalty" element={<DashboardLoyalty />} />
        <Route path="/dashboard/payments" element={<div className="dash-page"><div className="dash-header"><h1>Payment Methods</h1><p className="dash-sub">Manage your saved payment options</p></div><div className="dash-empty"><span style={{fontSize:40}}>💳</span><h3>No payment methods</h3><p>Add a payment method at checkout.</p></div></div>} />
        <Route path="/dashboard/security" element={<div className="dash-page"><div className="dash-header"><h1>Account Security</h1><p className="dash-sub">Manage your security settings</p></div><div className="dash-empty"><span style={{fontSize:40}}>🔒</span><h3>Security settings</h3><p>Manage your password and security preferences from your profile.</p></div></div>} />
        <Route path="/dashboard/preferences" element={<div className="dash-page"><div className="dash-header"><h1>Reading Preferences</h1><p className="dash-sub">Customize your reading experience</p></div><div className="dash-empty"><span style={{fontSize:40}}>📖</span><h3>Coming soon</h3><p>Reading preferences will be available in a future update.</p></div></div>} />
        <Route path="/dashboard/history" element={<div className="dash-page"><div className="dash-header"><h1>Search History</h1><p className="dash-sub">Your recent searches</p></div><div className="dash-empty"><span style={{fontSize:40}}>🔍</span><h3>No search history</h3><p>Your searches will appear here.</p></div></div>} />
        <Route path="/dashboard/settings" element={<div className="dash-page"><div className="dash-header"><h1>Settings</h1><p className="dash-sub">Account and app preferences</p></div><div className="dash-empty"><span style={{fontSize:40}}>⚙️</span><h3>Settings</h3><p>Settings management coming soon.</p></div></div>} />
      </Route>
    </Routes>
    </>
  );
}
