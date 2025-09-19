import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import farmersVideo from "../assets/farmers.mp4";
function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchProducts();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={{ padding: "0" }}>
      {/* --- Hero Section with Video --- */}
      <section style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        padding: "50px 20px", 
        textAlign: "center", 
        backgroundColor: "#eaf5e9"
      }}>
        <h2>Connecting Farmers Directly to You</h2>
        <p style={{ maxWidth: "600px", margin: "10px 0 30px" }}>
          MkulimaHub bridges the gap between local farmers and urban buyers, ensuring fresh produce and fair prices for all.
        </p>
        <button onClick={() => navigate('/MarketPlace')} style={{ 
          padding: "15px 30px", 
          fontSize: "1.2em", 
          cursor: "pointer", 
          backgroundColor: "#4CAF50", 
          color: "white", 
          border: "none", 
          borderRadius: "5px" 
        }}>
          Explore Products
        </button>
       <div style={{ marginTop: "40px", width: "100%", maxWidth: "800px" }}>
          <video
            src={farmersVideo} 
            autoPlay
            loop
            muted
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </div>
      </section>
    </div>
  );
}

export default HomePage;