import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // This function will fetch a list of products from your API
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products/");
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    
    // Check for a token. If no token, maybe redirect or show a login message.
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      // You can handle this by redirecting to a login page,
      // but the ProtectedRoute already handles this for us.
      // For this component, we'll just show an empty state.
      setLoading(false);
      return;
    }

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem("REFRESH_TOKEN"); // assuming you also store a refresh token
    navigate("/login");
  };

  if (loading) {
    return <div>Loading products...</div>;
  }
  
  // This is a simple placeholder for the UI
  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "20px" }}>
        <h1>MkulimaHub</h1>
        <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Logout
        </button>
      </header>

      <h2>Available Produce</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              <h3>{product.name}</h3>
              <p>by {product.farmer_name}</p>
              <p>KSh {product.price}</p>
              <p>{product.quantity} available</p>
            </div>
          ))
        ) : (
          <div>No products available yet.</div>
        )}
      </div>
    </div>
  );
}

export default HomePage;