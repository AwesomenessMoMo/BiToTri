import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "../styles/productdetails.css";
import API from "../config/api";

const ProductDetails = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/${type}/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);

                fetch(`${API}/api/${type}`)
                    .then(r => r.json())
                    .then(all => {
                        setRelated(
                            all.filter(
                                i =>
                                    i.id !== data.id &&
                                    i.category === data.category
                            ).slice(0, 4)
                        );
                    });
            })
            .catch(() => {
                toast.error("Product not found");
                navigate("/store");
            });
    }, [type, id, navigate]);

    if (loading) return <p className="loading">Loading...</p>;
    if (!product) return null;

    const handleAdd = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            type
        });
        toast.success(`${product.name} added to cart`);
    };

    const fallbackDescription =
        type === "supplements"
            ? "This premium supplement is designed to support performance, recovery, and overall training efficiency."
            : "High-quality athletic wear built for comfort, durability, and performance during intense workouts.";

    return (
        <div className="product-details-page">
            <div className="product-details">
                <img
                    src={`${API}/uploads/${product.image}`}
                    alt={product.name}
                    className="product-img"
                />

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="category">{product.category}</p>

                    <p className="desc">
                        {product.description || fallbackDescription}
                    </p>

                    {product.color && (
                        <p className="desc">
                            <strong>Color:</strong> {product.color}
                        </p>
                    )}

                    <div className="price">${product.price}</div>

                    <button onClick={handleAdd}>Add to Cart</button>
                </div>
            </div>

            {related.length > 0 && (
                <div className="related-section">
                    <h2>Related Products</h2>

                    <div className="related-grid">
                        {related.map(item => (
                            <Link
                                key={item.id}
                                to={`/product/${type}/${item.id}`}
                                className="related-card"
                            >
                                <img
                                    src={`${API}/uploads/${item.image}`}
                                    alt={item.name}
                                />
                                <h4>{item.name}</h4>
                                <p>${item.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
