
import React, { useEffect, useState } from "react";
import "../styles/supplements.css";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import API from "../config/api";

const Supplements = () => {
  const { addToCart } = useCart();
  const [params] = useSearchParams();

  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sortType, setSortType] = useState("");
  const [cardSize, setCardSize] = useState("large");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetch(`${API}/api/supplements`)
      .then(res => res.json())
      .then(data => {
        setSupplements(data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to load supplements");
      });
  }, []);

  useEffect(() => {
    const cat = params.get("category");
    if (cat) setCategory(cat);
  }, [params]);

  const isAvailable = (item) => {
    if (item.available === 0) return false;
    if (item.stock === 0) return false;
    return true;
  };

  const filtered = supplements
    .filter(item => isAvailable(item))
    .filter(item => {
      if (category === "All") return true;
      return item.category?.toLowerCase().includes(category.toLowerCase());
    })
    .filter(item => {
      if (minPrice && item.price < minPrice) return false;
      if (maxPrice && item.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortType === "low-high") return a.price - b.price;
      if (sortType === "high-low") return b.price - a.price;
      if (sortType === "az") return a.name.localeCompare(b.name);
      if (sortType === "za") return b.name.localeCompare(a.name);
      return 0;
    });

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: "supplement",
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="supplements-page">
      <aside className="filter-sidebar">
        <h2>Filter</h2>

        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>All</option>
          <option>Protein</option>
          <option>Creatine</option>
          <option>Amino Acid</option>
          <option>Vitamins</option>
          <option>Pre-Workout</option>
          <option>Post-Workout</option>
          <option>Fat Burner</option>
          <option>Mass Gainer</option>
        </select>

        <label>Price Range</label>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />

        <label>Sort</label>
        <select value={sortType} onChange={e => setSortType(e.target.value)}>
          <option value="">None</option>
          <option value="low-high">Low → High</option>
          <option value="high-low">High → Low</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>

        <Link to="/store" className="back-btn">← Back</Link>
      </aside>

      <div className="supplements-content">
        <div className="header-row">
          <h1>{category === "All" ? "Supplements" : category}</h1>

          <div className="size-controls">
            <button className={cardSize === "small" ? "active" : ""} onClick={() => setCardSize("small")}>S</button>
            <button className={cardSize === "medium" ? "active" : ""} onClick={() => setCardSize("medium")}>M</button>
            <button className={cardSize === "large" ? "active" : ""} onClick={() => setCardSize("large")}>L</button>
          </div>
        </div>

        {loading && <p className="loading">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="loading">No supplements found</p>}

        <div className={`products-grid size-${cardSize}`}>
          {filtered.map(item => (
            <div className="product-card" key={item.id}>
              <Link to={`/product/supplements/${item.id}`}>
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

              <p>${item.price}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Supplements;
