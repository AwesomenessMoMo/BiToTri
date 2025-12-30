import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/footer.css";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div className="footer-about">
          <img src={logo} alt="Bi To Tri Gym" className="logo-img-footer" />

          <p>
            Bi To Tri Gym is dedicated to strength, performance, and overall wellness.
            Trusted supplements, premium gear, and professional coaching.
          </p>

          <div className="footer-socials">
            <Link to="/home" aria-label="Facebook">
              <FaFacebookF />
            </Link>

            <Link to="/home" aria-label="Instagram">
              <FaInstagram />
            </Link>

            <Link to="/home" aria-label="TikTok">
              <FaTiktok />
            </Link>
          </div>
        </div>

        <div className="footer-col">
          <h3>Shop</h3>
          <Link to="/supplements">Supplements</Link>
          <Link to="/clothes">Clothes</Link>
          <Link to="/store">All Products</Link>
        </div>

        <div className="footer-col">
          <h3>Categories</h3>
          <Link to="/supplements?category=Protein">Protein</Link>
          <Link to="/supplements?category=Creatine">Creatine</Link>
          <Link to="/supplements?category=Amino%20Acid">Amino Acid</Link>
        </div>

        <div className="footer-col">
          <h3>Support</h3>
          <Link to="/coaches">Coaching</Link>
          <Link to="/contact-us">Contact Us</Link>
          <Link to="/faq">FAQ</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 Bi To Tri Gym. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
