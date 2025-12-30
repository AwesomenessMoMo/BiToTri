import React from "react";
import "../styles/store.css";
import supplementImage from "../assets/supplements-bg.png";
import clothesImage from "../assets/clothes-bg.png";
import { useNavigate } from "react-router-dom";

function Store() {
  const navigate = useNavigate();

  return (
    <div className="store-bg">  {}

      <div className="store-container">

        {}
        <div className="store-header">
          <h1>Fuel Your Fitness Journey</h1>
          <p>
            Explore our premium gym products — from high-quality supplements that power your 
            workouts to stylish athletic wear built for performance, comfort and confidence.
          </p>
        </div>

        {}
        <div className="store-grid">

          {/* SUPPLEMENTS */}
          <div
            className="store-item left-item"
            onClick={() => navigate("/Supplements")}
          >
            <img src={supplementImage} alt="Supplements" className="store-image" />
            <h2>Supplements</h2>
          </div>

          {/* CLOTHES */}
          <div
            className="store-item right-item"
            onClick={() => navigate("/Clothes")}
          >
            <img src={clothesImage} alt="Clothes" className="store-image" />
            <h2>Clothes</h2>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Store;
