import { createContext, useContext, useReducer, useEffect } from "react";

const DashboardContext = createContext();

const initialState = {
  notifications: [
    { id: 1, type: "order", title: "Order Confirmed", message: "Your order ORD-2026-003 has been confirmed.", date: "2026-06-26", read: false },
    { id: 2, type: "shipping", title: "Item Shipped", message: "Your book 'Atomic Habits' has been shipped.", date: "2026-06-27", read: false },
    { id: 3, type: "promo", title: "20% Off Weekend Sale", message: "Use code WEEKEND20 for 20% off all books.", date: "2026-06-28", read: true },
    { id: 4, type: "wishlist", title: "Price Drop Alert", message: "'The Power of Prayer' is now $12.99 (was $16.99).", date: "2026-06-29", read: false },
  ],
  searchHistory: ["African literature", "Chimamanda Adichie", "study bibles", "self improvement books", "children's storybooks"],
  readingProgress: [
    { bookId: 1, title: "Things Fall Apart", progress: 65, bookmarks: [12, 45, 78], highlights: 3 },
    { bookId: 11, title: "Born a Crime", progress: 30, bookmarks: [8, 25], highlights: 1 },
  ],
  addresses: [
    { id: 1, label: "Home", street: "123 Main Street", city: "Lagos", state: "Lagos", zip: "100001", country: "Nigeria", default: true },
    { id: 2, label: "Office", street: "45 Marina Road", city: "Lagos", state: "Lagos", zip: "100002", country: "Nigeria", default: false },
  ],
  paymentMethods: [
    { id: 1, type: "card", label: "Visa ending in 4242", last4: "4242", exp: "12/28", default: true },
    { id: 2, type: "mobile", label: "M-Pesa (+254 712 345 678)", provider: "M-Pesa", default: false },
  ],
  preferences: {
    favoriteGenres: ["Novels & Fiction", "Biography", "Religious & Faith"],
    favoriteAuthors: ["Chinua Achebe", "Chimamanda Ngozi Adichie"],
    preferredLanguage: "English",
    preferredFormat: "Paperback",
    darkMode: false,
  },
  loyaltyPoints: 1250,
  membershipLevel: "Gold",
  referralCode: "TANDA-JOHN-2026",
  recentlyViewed: [],
  readingChallenge: { target: 24, completed: 8 },
  monthlySpending: [
    { month: "Jan", amount: 42.97 }, { month: "Feb", amount: 18.99 },
    { month: "Mar", amount: 29.98 }, { month: "Apr", amount: 89.95 },
    { month: "May", amount: 14.99 }, { month: "Jun", amount: 67.96 },
  ],
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case "MARK_READ":
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case "MARK_ALL_READ":
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };

    case "ADD_SEARCH":
      return { ...state, searchHistory: [action.payload, ...state.searchHistory.filter(s => s !== action.payload)].slice(0, 20) };
    case "CLEAR_SEARCH":
      return { ...state, searchHistory: [] };

    case "UPDATE_PROGRESS":
      return { ...state, readingProgress: state.readingProgress.map(b => b.bookId === action.payload.bookId ? { ...b, ...action.payload } : b) };
    case "ADD_ADDRESS":
      return { ...state, addresses: [...state.addresses, action.payload] };
    case "UPDATE_ADDRESS":
      return { ...state, addresses: state.addresses.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a) };
    case "DELETE_ADDRESS":
      return { ...state, addresses: state.addresses.filter(a => a.id !== action.payload) };
    case "SET_DEFAULT_ADDRESS":
      return { ...state, addresses: state.addresses.map(a => ({ ...a, default: a.id === action.payload })) };

    case "ADD_PAYMENT":
      return { ...state, paymentMethods: [...state.paymentMethods, action.payload] };
    case "DELETE_PAYMENT":
      return { ...state, paymentMethods: state.paymentMethods.filter(p => p.id !== action.payload) };

    case "UPDATE_PREFERENCES":
      return { ...state, preferences: { ...state.preferences, ...action.payload } };

    case "ADD_RECENTLY_VIEWED":
      return { ...state, recentlyViewed: [action.payload, ...state.recentlyViewed.filter(b => b.id !== action.payload.id)].slice(0, 10) };

    case "REDEEM_POINTS":
      return { ...state, loyaltyPoints: state.loyaltyPoints - action.payload };

    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState, () => {
    try {
      const saved = localStorage.getItem("tanda_dashboard");
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem("tanda_dashboard", JSON.stringify(state));
  }, [state]);

  const addNotification = (n) => dispatch({ type: "ADD_NOTIFICATION", payload: { ...n, id: Date.now(), date: new Date().toISOString().split("T")[0], read: false } });
  const markRead = (id) => dispatch({ type: "MARK_READ", payload: id });
  const markAllRead = () => dispatch({ type: "MARK_ALL_READ" });

  const addSearch = (s) => dispatch({ type: "ADD_SEARCH", payload: s });
  const clearSearch = () => dispatch({ type: "CLEAR_SEARCH" });

  const updateProgress = (p) => dispatch({ type: "UPDATE_PROGRESS", payload: p });
  const addAddress = (a) => dispatch({ type: "ADD_ADDRESS", payload: a });
  const updateAddress = (a) => dispatch({ type: "UPDATE_ADDRESS", payload: a });
  const deleteAddress = (id) => dispatch({ type: "DELETE_ADDRESS", payload: id });
  const setDefaultAddress = (id) => dispatch({ type: "SET_DEFAULT_ADDRESS", payload: id });

  const addPayment = (p) => dispatch({ type: "ADD_PAYMENT", payload: p });
  const deletePayment = (id) => dispatch({ type: "DELETE_PAYMENT", payload: id });

  const updatePreferences = (p) => dispatch({ type: "UPDATE_PREFERENCES", payload: p });

  const addRecentlyViewed = (book) => dispatch({ type: "ADD_RECENTLY_VIEWED", payload: book });
  const redeemPoints = (points) => dispatch({ type: "REDEEM_POINTS", payload: points });

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const membershipColors = { Silver: "#94a3b8", Gold: "#f59e0b", Platinum: "#a78bfa" };

  return (
    <DashboardContext.Provider value={{
      ...state,
      unreadCount,
      membershipColors,
      addNotification, markRead, markAllRead,
      addSearch, clearSearch,
      updateProgress,
      addAddress, updateAddress, deleteAddress, setDefaultAddress,
      addPayment, deletePayment,
      updatePreferences,
      addRecentlyViewed, redeemPoints,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
