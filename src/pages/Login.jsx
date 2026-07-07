import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    login(email, password);
    const isAdmin = email === "admin@tandaafrica.com" || (email === "moses@tandaafrica.com" && password === "moses@");
    navigate(isAdmin ? "/admin" : "/account");
  };

  const handleGoogleSuccess = (user) => {
    googleLogin(user);
    navigate("/account");
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Sign In</h1>
          <p className="auth-subtitle">Welcome back to Tanda Africa</p>
          {error && <div className="auth-error">{error}</div>}
          <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-in failed.")} text="signin_with" />
          <div className="auth-divider"><span>or</span></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Sign In</button>
          </form>
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
