import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
  const [orders, setOrders] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/info/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, [token]);

  // Fetch dashboard data when user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const endpoint =
          user.role === "farmer" ? "/dashboard/farmer/" : "/dashboard/buyer/";
        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);

        // Recent Orders
        const ordersRes = await api.get("/dashboard/orders/recent/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersRes.data);

        // Sales Trend for Farmers
        if (user.role === "farmer") {
          const salesRes = await api.get("/dashboard/sales/trend/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSalesTrend(salesRes.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Welcome, {user?.username}!
      </h1>

      {/* Farmer Dashboard */}
      {user?.role === "farmer" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Farmer Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-green-100 rounded-lg shadow text-center">
              <h3 className="text-xl font-bold">Products</h3>
              <p className="text-2xl">{data.products}</p>
            </div>
            <div className="p-6 bg-green-100 rounded-lg shadow text-center">
              <h3 className="text-xl font-bold">Orders</h3>
              <p className="text-2xl">{data.orders}</p>
            </div>
            <div className="p-6 bg-green-100 rounded-lg shadow text-center">
              <h3 className="text-xl font-bold">Sales</h3>
              <p className="text-2xl">Ksh {data.sales}</p>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Sales Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4CAF50"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Buyer</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="p-3 border">{o.id}</td>
                <td className="p-3 border">{o.buyer}</td>
                <td className="p-3 border">Ksh {o.total}</td>
                <td className="p-3 border">{o.status}</td>
                <td className="p-3 border">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buyer Buttons */}
      {user?.role === "buyer" && (
        <div className="mt-6">
          <button
            onClick={() => navigate("/marketplace")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go Shopping
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
