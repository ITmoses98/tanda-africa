import { createContext, useContext, useReducer, useEffect } from "react";
import { categories as initialCategories } from "../data/books";

const AdminContext = createContext();

const initialState = {
  categories: initialCategories,
  coupons: [
    { id: 1, code: "WELCOME10", discount: 10, type: "percentage", minOrder: 20, maxUses: 100, used: 45, expires: "2026-12-31", active: true },
    { id: 2, code: "AFRICA10", discount: 10, type: "percentage", minOrder: 15, maxUses: 50, used: 23, expires: "2026-09-30", active: true },
    { id: 3, code: "FREESHIP", discount: 5, type: "fixed", minOrder: 50, maxUses: 200, used: 12, expires: "2026-08-15", active: true },
  ],
  reviews: [],
  orders: [
    { id: "ORD-2026-001", customer: "John Doe", email: "john@example.com", items: 3, total: 42.97, status: "Delivered", date: "2026-06-28", payment: "Card" },
    { id: "ORD-2026-002", customer: "Jane Smith", email: "jane@example.com", items: 1, total: 18.99, status: "Shipped", date: "2026-06-27", payment: "M-Pesa" },
    { id: "ORD-2026-003", customer: "Amina Okafor", email: "amina@example.com", items: 2, total: 29.98, status: "Processing", date: "2026-06-26", payment: "PayPal" },
    { id: "ORD-2026-004", customer: "David Kamau", email: "david@example.com", items: 5, total: 89.95, status: "Pending", date: "2026-06-25", payment: "Bank Transfer" },
    { id: "ORD-2026-005", customer: "Grace Mensah", email: "grace@example.com", items: 1, total: 14.99, status: "Cancelled", date: "2026-06-24", payment: "Card" },
    { id: "ORD-2026-006", customer: "Samuel Osei", email: "samuel@example.com", items: 2, total: 25.98, status: "Pending", date: "2026-06-23", payment: "M-Pesa" },
    { id: "ORD-2026-007", customer: "Faith Njoroge", email: "faith@example.com", items: 4, total: 67.96, status: "Processing", date: "2026-06-22", payment: "PayPal" },
  ]
};

function adminReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };

    case "ADD_COUPON":
      return { ...state, coupons: [...state.coupons, action.payload] };
    case "UPDATE_COUPON":
      return { ...state, coupons: state.coupons.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case "TOGGLE_COUPON": {
      const c = state.coupons.find(c => c.id === action.payload);
      return { ...state, coupons: state.coupons.map(c => c.id === action.payload ? { ...c, active: !c.active } : c) };
    }
    case "USE_COUPON":
      return { ...state, coupons: state.coupons.map(c => c.code === action.payload ? { ...c, used: c.used + 1 } : c) };

    case "ADD_REVIEW":
      return { ...state, reviews: [...state.reviews, { ...action.payload, id: Date.now(), date: new Date().toISOString().split("T")[0], status: "Pending" }] };
    case "APPROVE_REVIEW":
      return { ...state, reviews: state.reviews.map(r => r.id === action.payload ? { ...r, status: "Approved" } : r) };
    case "REJECT_REVIEW":
      return { ...state, reviews: state.reviews.map(r => r.id === action.payload ? { ...r, status: "Rejected" } : r) };

    case "UPDATE_ORDER_STATUS":
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status } : o) };

    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState, () => {
    try {
      const saved = localStorage.getItem("tanda_admin");
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem("tanda_admin", JSON.stringify(state));
  }, [state]);

  const setCategories = (cats) => dispatch({ type: "SET_CATEGORIES", payload: cats });
  const addCategory = (cat) => dispatch({ type: "ADD_CATEGORY", payload: cat });
  const updateCategory = (cat) => dispatch({ type: "UPDATE_CATEGORY", payload: cat });
  const deleteCategory = (id) => dispatch({ type: "DELETE_CATEGORY", payload: id });

  const addCoupon = (c) => dispatch({ type: "ADD_COUPON", payload: c });
  const updateCoupon = (c) => dispatch({ type: "UPDATE_COUPON", payload: c });
  const toggleCoupon = (id) => dispatch({ type: "TOGGLE_COUPON", payload: id });
  const useCoupon = (code) => dispatch({ type: "USE_COUPON", payload: code });

  const addReview = (r) => dispatch({ type: "ADD_REVIEW", payload: r });
  const approveReview = (id) => dispatch({ type: "APPROVE_REVIEW", payload: id });
  const rejectReview = (id) => dispatch({ type: "REJECT_REVIEW", payload: id });

  const updateOrderStatus = (id, status) => dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } });

  const getValidCoupon = (code) => {
    const c = state.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!c || !c.active) return null;
    if (c.maxUses && c.used >= c.maxUses) return null;
    if (c.expires && new Date(c.expires) < new Date()) return null;
    return c;
  };

  const getApprovedReviews = (bookId) => state.reviews.filter(r => r.bookId === bookId && r.status === "Approved");

  return (
    <AdminContext.Provider value={{
      categories: state.categories,
      coupons: state.coupons,
      reviews: state.reviews,
      orders: state.orders,
      setCategories, addCategory, updateCategory, deleteCategory,
      addCoupon, updateCoupon, toggleCoupon, useCoupon, getValidCoupon,
      addReview, approveReview, rejectReview, getApprovedReviews,
      updateOrderStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
