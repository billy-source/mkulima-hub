import React, { useEffect, useState, useContext } from "react";
import api from "../api"; // Assuming a pre-configured Axios instance
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // This function fetches products based on search and filter criteria.
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) {
          params.search = searchQuery;
        }
        if (filterType !== "all") {
          params.category = filterType;
        }

        const res = await api.get("/api/products/", { params });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, filterType]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    try {
      await api.post("/api/cart/add/", { product_id: productId, quantity: 1 });
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const productCategories = ["all", "fruits", "vegetables", "cereals"]; // Example categories

  return (
    <div className="container" style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "20px", marginBottom: "30px" }}>
        <h1 style={{ color: "#2E8B57" }}>MkulimaHub Marketplace</h1>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#36a2eb", color: "white", border: "none", borderRadius: "5px" }}>
          Go to Dashboard
        </button>
      </header>

      <main>
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search for produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            {productCategories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>Loading produce...</h2>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} style={{ border: "1px solid #eee", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>{product.name}</h3>
                  <p style={{ margin: "0", color: "#666" }}>by *{product.farmer_name}*</p>
                  <p style={{ margin: "5px 0", fontSize: "1.2em", fontWeight: "bold", color: "#333" }}>Ksh {product.price} / {product.unit}</p>
                  <p style={{ margin: "0", color: "#666" }}>*Quantity:* {product.quantity} available</p>
                  <button onClick={() => handleAddToCart(product.id)} style={{ marginTop: "15px", width: "100%", padding: "10px", backgroundColor: "#2E8B57", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#888", padding: "50px" }}>
                <p>No produce matching your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Marketplace;