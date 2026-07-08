import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const redirect = search.get("redirect") || "/";

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
    register(name, email, password);
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
