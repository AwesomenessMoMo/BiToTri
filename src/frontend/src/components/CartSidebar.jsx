import React, { useEffect, useRef } from "react";
import "../styles/cartsidebar.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

const CartSidebar = ({ open, close }) => {
    const { cart, addToCart, removeOne, removeAll } = useCart();
    const ref = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) close();
        };
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, close]);

    return (
        <div className={`cart-overlay ${open ? "show" : ""}`}>
            <div className="cart-sidebar" ref={ref}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-btn" onClick={close}>✕</button>
                </div>

                {cart.length === 0 ? (
                    <p className="empty-msg">Your cart is empty</p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map((item) => {
                                const productId = item.product_id ?? item.id;

                                return (
                                    <div
                                        className="cart-item"
                                        key={`${item.product_type}-${productId}`}
                                    >
                                        <img
                                            src={`${API}/uploads/${item.image}`}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/placeholder.png";
                                            }}
                                        />

                                        <div className="cart-info">
                                            <h4>{item.name}</h4>
                                            <p className="price">${item.price}</p>

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

                                                <button
                                                    onClick={() =>
                                                        addToCart({
                                                            id: productId,
                                                            name: item.name,
                                                            price: item.price,
                                                            type: item.product_type
                                                        })
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <p className="total">
                                                Total: ${(item.price * item.qty).toFixed(2)}
                                            </p>

                                            <button
                                                className="remove-all"
                                                onClick={() => removeAll(productId)}
                                            >
                                                Remove Item
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="checkout-section">
                            <button
                                className="checkout-btn"
                                onClick={() => {
                                    close();
                                    navigate("/checkout");
                                }}
                            >
                                Proceed to Checkout →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
