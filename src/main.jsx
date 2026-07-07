import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { BookProvider } from "./context/BookContext";
import { AdminProvider } from "./context/AdminContext";
import App from "./App";
import "./styles/App.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const hasGoogleConfig = GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("your-google");

function Root({ children }) {
  if (hasGoogleConfig) {
    return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
  }
  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Root>
        <AuthProvider>
          <AdminProvider>
            <BookProvider>
              <CartProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </CartProvider>
            </BookProvider>
          </AdminProvider>
        </AuthProvider>
      </Root>
    </BrowserRouter>
  </StrictMode>
);
