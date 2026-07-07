import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext();

function wishlistReducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.includes(action.payload);
      return exists ? state.filter(id => id !== action.payload) : [...state, action.payload];
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, [], () => {
    try {
      const saved = localStorage.getItem("tanda_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tanda_wishlist", JSON.stringify(state));
  }, [state]);

  const toggleWishlist = (id) => dispatch({ type: "TOGGLE", payload: id });
  const isInWishlist = (id) => state.includes(id);
  const clearWishlist = () => dispatch({ type: "CLEAR" });

  return (
    <WishlistContext.Provider value={{ items: state, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
