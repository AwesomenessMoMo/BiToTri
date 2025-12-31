import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
import "../styles/checkout.css";
import axios from "axios";
import API from "../config/api";

const Checkout = () => {
  const { cart, addToCart, removeOne, removeAll } = useCart();
  const location = useLocation();

  const getStoredPlan = () => {
    try {
      const stored = localStorage.getItem("selectedPlan");
      if (stored) {
        const planData = JSON.parse(stored);
        return {
          plan: planData.plan || null,
          price: planData.price || 0,
          description: planData.description || ""
        };
      }
    } catch (e) {
      console.error("Error reading stored plan:", e);
    }
    return { plan: null, price: 0, description: "" };
  };

  const getInitialPlan = () => {
    if (location.state?.plan) {
      return {
        plan: location.state.plan,
        price: location.state.price || 0,
        description: location.state.description || ""
      };
    }
    return getStoredPlan();
  };

  const [selectedPlan, setSelectedPlan] = useState(() => getInitialPlan().plan);
  const [selectedPrice, setSelectedPrice] = useState(() => Number(getInitialPlan().price));
  const [planDescription, setPlanDescription] = useState(() => getInitialPlan().description);

  useEffect(() => {
    if (location.state?.plan) {
      const planData = {
        plan: location.state.plan,
        price: location.state.price || 0,
        description: location.state.description || ""
      };
      localStorage.setItem("selectedPlan", JSON.stringify(planData));
      setSelectedPlan(planData.plan);
      setSelectedPrice(Number(planData.price));
      setPlanDescription(planData.description);
    }
  }, [location.state]);

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const removePlan = () => {
    localStorage.removeItem("selectedPlan");
    setSelectedPlan(null);
    setSelectedPrice(0);
    setPlanDescription("");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const planTotal = Number(selectedPrice);
  const subtotal = cartTotal + planTotal;
  const grandTotal = Math.max(subtotal - discount, 0);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();

    if (code === "BITOTRI10") {
      setDiscount(subtotal * 0.1);
    } else if (code === "GYM20") {
      setDiscount(20);
    } else if (code === "WEB2") {
      setDiscount(subtotal * 0.99);
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  const handlePayment = async () => {
    if (!name || !cardNumber || !expiry || !cvc) {
      alert("Please fill all payment fields.");
      return;
    }

    try {
      const orderData = {
        plan: selectedPlan,
        planPrice: planTotal,
        items: cart.map((item) => ({
          product_id: item.product_id ?? item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        promo: promo.trim() || null,
        discount,
        total: grandTotal,
        payment: {
          method: "mastercard",
          cardholder: name,
          cardLast4: (cardNumber.replace(/\s/g, "") || "").slice(-4),
          expiry,
        },
      };

      await axios.post(`${API}/api/orders`, orderData, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem("selectedPlan");
      alert("Order placed successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="order-summary">
          <h2>Order Summary</h2>

          {selectedPlan && (
            <div className="checkout-item">
              <div className="checkout-left">
                <div>
                  <p className="item-name">{selectedPlan}</p>
                  {planDescription && (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      {planDescription}
                    </p>
                  )}
                </div>
              </div>
              <div className="checkout-right">
                <span>${planTotal.toFixed(2)}</span>
                <button className="remove-item" onClick={removePlan} title="Remove plan">
                  ✖
                </button>
              </div>
            </div>
          )}

          {cart.map((item) => {
            const productId = item.product_id ?? item.id;

            return (
              <div key={productId} className="checkout-item">
                <div className="checkout-left">
                  <img
                    src={`${API}/uploads/${item.image}`}
                    alt={item.name}
                    className="checkout-img"
                  />
                  <div>
                    <p className="item-name">{item.name}</p>
                    <div className="qty-controls">
                      <button
                        onClick={() => {
                          if (item.qty > 1) {
                            removeOne(productId);
                          } else {
                            removeAll(productId);
                          }
                        }}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>
                </div>

                <div className="checkout-right">
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                  <button className="remove-item" onClick={() => removeAll(productId)}>
                    ✖
                  </button>
                </div>
              </div>
            );
          })}

          <div className="promo-box">
            <input
              type="text"
              className="promo-input"
              placeholder="Promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button className="promo-btn" onClick={applyPromo}>
              Apply
            </button>
          </div>

          {discount > 0 && (
            <div className="checkout-item discount">
              <p>Discount</p>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}

          <h3 className="total">Total: ${grandTotal.toFixed(2)}</h3>
        </div>

        <div className="payment-section">
          <h2>Payment Method</h2>

          <label className="pay-label">Cardholder Name</label>
          <input
            type="text"
            className="pay-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="pay-label">Card Number</label>
          <div className="card-input-wrapper">
            <input
              type="text"
              className="pay-input"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, "");
                setCardNumber(clean.replace(/(.{4})/g, "$1 ").trim());
              }}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              className="card-logo"
              alt="mastercard"
            />
          </div>

          <div className="pay-row">
            <div className="pay-col">
              <label className="pay-label">Expiry</label>
              <input
                type="text"
                className="pay-input"
                maxLength={5}
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length >= 3) v = v.replace(/(\d{2})/, "$1/");
                  setExpiry(v);
                }}
              />
            </div>

            <div className="pay-col">
              <label className="pay-label">CVC</label>
              <input
                type="password"
                className="pay-input"
                maxLength={3}
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <button className="pay-btn" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
