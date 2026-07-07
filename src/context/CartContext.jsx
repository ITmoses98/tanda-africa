import { createContext, useContext, useReducer, useEffect } from "react";
import { useAdmin } from "./AdminContext";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };
    case "CLEAR_CART":
      return { ...state, items: [], coupon: null };
    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };
    case "REMOVE_COUPON":
      return { ...state, coupon: null };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { getValidCoupon, useCoupon } = useAdmin();
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null }, () => {
    try {
      const saved = localStorage.getItem("tanda_cart");
      return saved ? JSON.parse(saved) : { items: [], coupon: null };
    } catch {
      return { items: [], coupon: null };
    }
  });

  useEffect(() => {
    localStorage.setItem("tanda_cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (book) => dispatch({ type: "ADD_TO_CART", payload: book });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const applyCoupon = (code) => {
    const valid = getValidCoupon(code);
    if (valid) {
      dispatch({ type: "APPLY_COUPON", payload: valid });
      useCoupon(code);
      return true;
    }
    return false;
  };
  const removeCoupon = () => dispatch({ type: "REMOVE_COUPON" });

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const discount = state.coupon
    ? state.coupon.type === "percentage"
      ? subtotal * (state.coupon.discount / 100)
      : state.coupon.discount
    : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <CartContext.Provider value={{
      items: state.items,
      coupon: state.coupon,
      itemCount,
      subtotal,
      shipping,
      discount,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
