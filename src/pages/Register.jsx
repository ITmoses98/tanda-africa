import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState("form"); // form | verify
  const pending = useRef(null);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const redirect = search.get("redirect") || "/";

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setError("Email service not configured. The owner needs to set up EmailJS env vars.");
      return;
    }

    setSending(true);
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    pending.current = { name, email, password };

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: { name, email, code, redirect_url: window.location.origin + redirect },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to send email");
      }
      setSentCode(c);
      setStep("verify");
    } catch (err) {
      setError("Failed to send verification email: " + err.message);
    }
    setSending(false);
  };

  const verifyCode = () => {
    if (code === sentCode) {
      setVerified(true);
      register(pending.current.name, pending.current.email, pending.current.password);
      navigate(redirect);
    } else {
      setError("Invalid verification code");
    }
  };

  const handleGoogleSuccess = (user) => {
    googleLogin(user);
    navigate(redirect);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join Africa's largest reading community</p>
          {error && <div className="auth-error">{error}</div>}
          <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-up failed.")} text="signup_with" />
          <div className="auth-divider"><span>or</span></div>

          {step === "form" ? (
            <form onSubmit={sendCode}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required /> I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                {sending ? "Sending verification..." : "Create Account"}
              </button>
            </form>
          ) : (
            <div className="verify-section" style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ marginBottom: 16, color: "var(--gray-600)" }}>
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={{
                  width: 200,
                  textAlign: "center",
                  letterSpacing: 8,
                  fontSize: 24,
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "1px solid var(--gray-200)",
                  marginBottom: 16,
                }}
              />
              <br />
              <button type="button" className="btn btn-primary" onClick={verifyCode} style={{ padding: "10px 32px", fontSize: 15 }}>
                Verify Email
              </button>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--gray-500)" }}>
                Didn't get it? <button type="button" onClick={sendCode} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>Resend</button>
              </p>
            </div>
          )}

          <p className="auth-footer">
            Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
