import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import PhoneInput from "../components/PhoneInput";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneData, setPhoneData] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const redirect = search.get("redirect") || "/";

  const handlePhoneChange = (val) => setPhoneData(val);

  const sendCode = async () => {
    if (!phoneData || !phoneData.number) {
      setError("Enter your phone number first");
      return;
    }
    setError("");
    setSending(true);
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(c);
    setVerified(false);
    setCode("");

    const fullPhone = `${phoneData.dial}${phoneData.number}`;

    try {
      const res = await fetch("/.netlify/functions/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code: c }),
      });
      const data = await res.json();
      if (!data.success) {
        console.warn("SMS function failed, code logged to console:", c);
      }
    } catch {
      console.warn("Netlify function unavailable, code logged to console:", c);
    }

    setSending(false);
  };

  const verifyCode = () => {
    if (code === sentCode) {
      setVerified(true);
      setError("");
    } else {
      setError("Invalid verification code");
    }
  };

  const handleSubmit = (e) => {
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
    if (!phoneData || !phoneData.number) {
      setError("Phone number is required");
      return;
    }
    if (!verified) {
      setError("Please verify your phone number");
      return;
    }
    const fullPhone = `${phoneData.dial}${phoneData.number}`;
    register(name, email, password, fullPhone);
    navigate(redirect);
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
          <form onSubmit={handleSubmit}>
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
            <div className="form-group">
              <label>Phone Number</label>
              <PhoneInput required onChange={handlePhoneChange} defaultCode="NG" />
              {!verified ? (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary" onClick={sendCode} disabled={sending} style={{ flex: 1, padding: "8px 12px", fontSize: 13 }}>
                    {sending ? "Sending..." : "Send Code"}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 8, color: "#22c55e", fontSize: 13, fontWeight: 600 }}>✓ Phone verified</div>
              )}
              {sentCode && !verified && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    style={{ flex: 1, textAlign: "center", letterSpacing: 4, fontSize: 16 }}
                  />
                  <button type="button" className="btn btn-primary" onClick={verifyCode} style={{ padding: "8px 16px", fontSize: 13 }}>Verify</button>
                </div>
              )}
            </div>
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" required /> I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Create Account</button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
