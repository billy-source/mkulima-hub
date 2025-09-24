import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(AuthContext);
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
        let endpoint = "";
        if (user.role === "farmer") {
          endpoint = "/api/farmer/my-products/";
        } else if (user.role === "customer") {
          endpoint = "/api/customer/my-orders/";
        }

        if (endpoint) {
          const res = await api.get(endpoint);
          setData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddNew = () => {
    if (user?.role === "farmer") {
      navigate("/add-product");
    }
  };

  const renderFarmerDashboard = () => (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-semibold">Your Listings</h3>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Add New Product
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>You have not listed any products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h4 className="text-lg font-bold text-gray-800">{product.name}</h4>
              <p className="text-gray-600">Price: Ksh {product.price}</p>
              <p className="text-gray-600">Quantity: {product.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCustomerDashboard = () => (
    <>
      <h3 className="text-xl font-semibold mb-5">Your Order History</h3>
      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>You have no past orders. Explore the homepage to start shopping!</p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <p className="font-bold text-green-700">Order ID: #{order.id}</p>
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
      <div className="text-center py-12">
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <main>
        <h2 className="text-2xl font-semibold mb-6">
  Welcome, {user?.username || "User"}!
</h2>
        {user?.role === "farmer"
          ? renderFarmerDashboard()
          : renderCustomerDashboard()}
      </main>
    </div>
  );
}

export default Dashboard;
