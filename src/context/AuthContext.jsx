import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    case "REGISTER":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, isAuthenticated: false }, () => {
    try {
      const saved = localStorage.getItem("tanda_auth");
      return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  });

  useEffect(() => {
    localStorage.setItem("tanda_auth", JSON.stringify(state));
  }, [state]);

  const login = (email, password) => {
    const isAdmin = email === "admin@tandaafrica.com" || (email === "moses@tandaafrica.com" && password === "moses@");
    const user = {
      id: isAdmin ? 0 : 1,
      name: isAdmin ? "Admin" : email.split("@")[0],
      email,
      role: isAdmin ? "admin" : "customer",
      phone: "+234 800 000 0000",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      addresses: [
        { id: 1, label: "Home", street: "123 Main Street", city: "Lagos", state: "Lagos", zip: "100001", country: "Nigeria", default: true }
      ],
      orders: [
        { id: "ORD-2024-001", date: "2024-12-15", total: 42.97, status: "Delivered", items: 3 },
        { id: "ORD-2024-002", date: "2024-11-20", total: 18.99, status: "Shipped", items: 1 }
      ],
      wishlist: []
    };
    dispatch({ type: "LOGIN", payload: user });
    return true;
  };

  const googleLogin = (googleUser) => {
    const user = {
      id: Date.now(),
      name: googleUser.name,
      email: googleUser.email,
      role: "customer",
      phone: "",
      avatar: googleUser.picture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      addresses: [],
      orders: [],
      wishlist: []
    };
    dispatch({ type: "LOGIN", payload: user });
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  const register = (name, email, password, phone = "") => {
    const user = {
      id: Date.now(),
      name,
      email,
      phone,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      addresses: [],
      orders: [],
      wishlist: []
    };
    dispatch({ type: "REGISTER", payload: user });
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isAdmin: state.user?.role === "admin",
      login,
      logout,
      register,
      googleLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
