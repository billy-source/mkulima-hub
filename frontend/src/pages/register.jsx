import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/register/", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email,
          phone,
          role
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.detail || JSON.stringify(data));
        return;
      }

      navigate("/login");
    } catch (error) {
      setErrorMessage("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-md w-full p-10 rounded-3xl bg-white/20 shadow-2xl border border-white/30 animate-float"
      >
        <Link to="/" className="absolute top-3 right-3 text-white hover:text-gray-300 transition duration-300">
          X
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Register</h1>
        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}

        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 mb-4 rounded-xl" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 mb-4 rounded-xl" />
        <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 mb-4 rounded-xl" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 mb-4 rounded-xl" />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-4 mb-4 rounded-xl" />

        <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-4 mb-4 rounded-xl">
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
        </select>

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-blue-500 text-white shadow-lg">
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-6 text-center text-white font-semibold">
          Already Registered? <Link to="/login" className="text-blue-300 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
