import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import API from "../config/api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const { user, isLoggedIn } = useAuth();
    const [cart, setCart] = useState([]);

    const reloadCart = useCallback(async () => {
        if (!user?.id) return;

        try {
            const res = await fetch(`${API}/api/cart/${user.id}`);
            const data = await res.json();
            setCart(Array.isArray(data) ? data : []);
        } catch {
            setCart([]);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!isLoggedIn || !user?.id) {
            setCart([]);
            return;
        }
        reloadCart();
    }, [isLoggedIn, user?.id, reloadCart]);

    const addToCart = async (item) => {
        if (!isLoggedIn || !user?.id) {
            alert("Please login to add items to cart");
            return;
        }

        const productId = item.product_id ?? item.id;

        await fetch(`${API}/api/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                product_id: productId,
                product_type: item.type || "product",
                name: item.name,
                price: item.price,
                qty: 1
            })
        });

        reloadCart();
    };

    const removeOne = async (product_id) => {
        if (!user?.id) return;

        await fetch(`${API}/api/cart/remove-one`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, product_id })
        });

        reloadCart();
    };

    const removeAll = async (product_id) => {
        if (!user?.id) return;

        await fetch(`${API}/api/cart/${user.id}/${product_id}`, {
            method: "DELETE"
        });

        reloadCart();
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeOne,
                removeAll
            }}
        >
            {children}
        </CartContext.Provider>
    );
}