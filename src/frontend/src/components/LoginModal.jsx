import React, { useState } from "react";
import "../styles/loginmodal.css";
import { useAuth } from "../context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import API from "../config/api";

function LoginModal({ close, openSignup }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data || {};
      const user = data.user || data;
      const token = data.token || data.accessToken;

      if (!user) {
        setError("Login failed");
        return;
      }

      login(user, token);
      close();
    } catch (err) {
      setError(err?.response?.data?.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Login</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="email"
            placeholder="Email"
            className="modal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="modal-switch">
          Don’t have an account?{" "}
          <span
            className="modal-switch-link"
            onClick={() => {
              close();
              openSignup();
            }}
          >
            Sign Up
          </span>
        </p>

        <button className="modal-close" onClick={close}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
