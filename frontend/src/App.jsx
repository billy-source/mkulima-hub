import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/Homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import MarketPlace from "./pages/marketplace";
import Dashboard from "./pages/dashboard";
import Cart from "./pages/cart";
import './index.css';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MarketPlace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;