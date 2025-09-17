import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        let endpoint = '';
        if (user.role === "farmer") {
          endpoint = "/api/farmer/my-products/";
        } else if (user.role === "customer") {
          endpoint = "/api/customer/my-orders/";
        }

        const res = await api.get(endpoint);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddNew = () => {
    if (user.role === "farmer") {
      navigate("/add-product");
    }
  };

  const renderFarmerDashboard = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: "0" }}>Your Listings</h3>
        <button onClick={handleAddNew} style={{ padding: "10px 15px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          + Add New Product
        </button>
      </div>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: "50px" }}>
          <p>You have not listed any products yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
          {data.map(product => (
            <div key={product.id} style={{ border: "1px solid #eee", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{product.name}</h4>
              <p style={{ margin: "0", color: "#666" }}>*Price:* Ksh {product.price}</p>
              <p style={{ margin: "5px 0 0", color: "#666" }}>*Quantity:* {product.quantity} available</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCustomerDashboard = () => (
    <>
      <h3 style={{ marginBottom: "20px" }}>Your Order History</h3>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: "50px" }}>
          <p>You have no past orders. Explore the homepage to start shopping!</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#2E8B57", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {data.map(order => (
            <div key={order.id} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <p style={{ fontWeight: "bold", color: "#2E8B57" }}>Order ID: #{order.id}</p>
              <p>Total: Ksh {order.total_price}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "20px", marginBottom: "30px" }}>
        <h1 style={{ color: "#2E8B57" }}>Dashboard</h1>
        <button onClick={logout} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}>
          Logout
        </button>
      </header>
      <main>
        <h2 style={{ marginBottom: "20px" }}>
          Welcome, {user?.username}! 
        </h2>
        {user?.role === "farmer" ? renderFarmerDashboard() : renderCustomerDashboard()}
      </main>
    </div>
  );
}

export default Dashboard;