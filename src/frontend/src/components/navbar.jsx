import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/navbar.css";
import ReorderIcon from "@mui/icons-material/Reorder";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import CartSidebar from "./CartSidebar";
import axios from "axios";
import API from "../config/api";

function Navbar({ openMenu, toggleMenu }) {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const { user, isLoggedIn, logout } = useAuth();
  const { cart } = useCart();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`${API}/api/search?q=${encodeURIComponent(query)}`);
        setSuggestions(res.data || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`${API}/api/user/bookings/${user.id}`)
      .then((res) => setBookings(res.data || []))
      .catch(() => setBookings([]));
  }, [user?.id]);

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${API}/api/user/bookings/${bookingId}/${user.id}`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const selectSuggestion = (item) => {
    navigate(item.path);
    setQuery("");
    setSuggestions([]);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`);
    } catch {}
    logout();
    navigate("/home");
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/home">
            <img src={logo} className="logo-img" alt="logo" />
          </Link>
        </div>

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search coaches, supplements, clothes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon className="search-icon" />

          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => selectSuggestion(s)}
                >
                  <strong>{s.name}</strong>
                  <div className="suggestion-type">{s.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`nav-links ${openMenu ? "opened" : ""}`}>
          {user?.role === "admin" && (
            <span className="nav-text-link" onClick={() => navigate("/admin")}>
              Admin
            </span>
          )}

          <Link to="/store">Store</Link>
          <Link to="/training-programs">Training Programs</Link>

          {!isLoggedIn ? (
            <>
              <span className="nav-text-link" onClick={() => setShowLogin(true)}>
                Login
              </span>
              <span className="nav-text-link" onClick={() => setShowSignup(true)}>
                Sign Up
              </span>
            </>
          ) : (
            <div className="user-dropdown" ref={dropdownRef}>
              <span className="nav-user" onClick={() => setOpenUserMenu(!openUserMenu)}>
                {user.name.split(" ")[0]} ▾
              </span>

              {openUserMenu && (
                <div className="user-menu">
                  <h4>My Bookings</h4>

                  {bookings.length === 0 ? (
                    <p className="empty">No bookings</p>
                  ) : (
                    bookings.map((b) => (
                      <div key={b.id} className="booking-item">
                        <div>
                          <strong>{b.coach_name}</strong>
                          <span>
                            {b.booking_date} @ {b.booking_time}
                          </span>
                        </div>
                        <button className="cancel-btn" onClick={() => cancelBooking(b.id)}>
                          ✖
                        </button>
                      </div>
                    ))
                  )}

                  <hr />

                  <span className="logout-btn" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              )}
            </div>
          )}

          <span className="nav-text-link" onClick={() => setOpenCart(true)}>
            🛒 Cart ({cart.length})
          </span>
        </div>

        <button className="mobile-menu-icon" onClick={toggleMenu}>
          <ReorderIcon />
        </button>
      </nav>

      {showSignup && (
        <SignupModal
          close={() => setShowSignup(false)}
          openLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}

      {showLogin && (
        <LoginModal
          close={() => setShowLogin(false)}
          openSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      <CartSidebar open={openCart} close={() => setOpenCart(false)} />
    </>
  );
}

export default Navbar;
