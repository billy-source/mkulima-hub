import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/Homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import MarketPlace from "./pages/MarketPlace";
import Dashboard from "./pages/dashboard";
import Cart from "./pages/cart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About"; 
import Contacts from "./pages/Contacts"; 
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Main container with flexbox for sticky footer */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          
          {/* Main content area */}
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/marketplace" element={<MarketPlace />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;