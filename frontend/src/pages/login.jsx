import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);

      login(data.access, data.role || "farmer");
    } catch (error) {
      alert(error.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Login Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 max-w-md w-full p-10 rounded-3xl bg-white/20 shadow-2xl border border-white/30 animate-float"
          style={{
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
          }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
            Login
          </h1>
          <input
            className="w-full p-4 mb-5 border border-white/50 rounded-xl bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="w-full p-4 mb-5 border border-white/50 rounded-xl bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <p className="mb-5 text-center text-white font-semibold drop-shadow-sm">
            Not Registered?{" "}
            <span className="text-blue-300 hover:underline">
              <Link to="/register">Register</Link>
            </span>
          </p>
          <button
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Floating animation CSS */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </>
  );
}

export default Login;
