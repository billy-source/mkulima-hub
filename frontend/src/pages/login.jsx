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
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/Images/home.jpg)" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <form
        onSubmit={handleSubmit}
        className="z-10 max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-36"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <p className="p-4 font-semibold">
          Not Registered?{" "}
          <span className="text-blue-500">
            <Link to="/register">Register</Link>
          </span>
        </p>
        <button
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;