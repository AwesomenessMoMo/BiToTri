import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/clothes.css";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import API from "../config/api";

const Clothes = () => {
  const { addToCart } = useCart();
  const [params] = useSearchParams();

  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [color, setColor] = useState("All");
  const [sortType, setSortType] = useState("");
  const [cardSize, setCardSize] = useState("large");

  useEffect(() => {
    fetch(`${API}/api/clothes`)
      .then(res => res.json())
      .then(data => {
        setClothes(data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to load clothes");
      });
  }, []);

  useEffect(() => {
    const cat = params.get("category");
    if (cat) setCategory(cat);
  }, [params]);

  const colors = ["All", ...new Set(clothes.map(c => c.color).filter(Boolean))];

  const filtered = clothes
    .filter(i => category === "All" || i.category === category)
    .filter(i => color === "All" || i.color === color)
    .sort((a, b) => {
      if (sortType === "low-high") return a.price - b.price;
      if (sortType === "high-low") return b.price - a.price;
      return 0;
    });

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: "clothes",
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="clothes-page">
      <aside className="clothes-sidebar">
        <h2>Filter</h2>

        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>All</option>
          <option>T-Shirts</option>
          <option>Hoodies</option>
          <option>Shorts</option>
          <option>Pants</option>
        </select>

        <label>Color</label>
        <select value={color} onChange={e => setColor(e.target.value)}>
          {colors.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label>Sort</label>
        <select value={sortType} onChange={e => setSortType(e.target.value)}>
          <option value="">None</option>
          <option value="low-high">Low → High</option>
          <option value="high-low">High → Low</option>
        </select>

        <Link to="/store" className="back-btn">← Back</Link>
      </aside>

      <div className="clothes-content">
        <div className="header-row">
          <h1>{category === "All" ? "Clothes" : category}</h1>

          <div className="size-controls">
            <button
              className={cardSize === "small" ? "active" : ""}
              onClick={() => setCardSize("small")}
            >
              S
            </button>
            <button
              className={cardSize === "medium" ? "active" : ""}
              onClick={() => setCardSize("medium")}
            >
              M
            </button>
            <button
              className={cardSize === "large" ? "active" : ""}
              onClick={() => setCardSize("large")}
            >
              L
            </button>
          </div>
        </div>

        {loading && <p className="loading">Loading clothes...</p>}

        {!loading && filtered.length === 0 && (
          <p className="loading">No clothes found</p>
        )}

        <div className={`clothes-grid size-${cardSize}`}>
          {filtered.map(item => (
            <div className="clothes-card" key={item.id}>
              <Link to={`/product/clothes/${item.id}`}>
                <img
                  src={`${API}/uploads/${item.image}`}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
                <h3>{item.name}</h3>
              </Link>

              <p className="price">${item.price}</p>
              <p className="color">Color: {item.color}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clothes;
