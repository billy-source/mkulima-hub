import React, { useEffect, useState } from "react";
import api from "../api"; // Axios instance
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetches the user's cart items from the backend API.
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/cart/");
        setCartItems(res.data.items);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId) => {
    // Deletes an item from the cart.
    try {
      await api.delete(`/api/cart/items/${itemId}/`);
      // Update state to remove the item from the UI.
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      // Recalculate the total
      const newTotal = updatedItems.reduce((acc, item) => acc + item.price, 0);
      setTotal(newTotal);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCheckout = async () => {
    // Processes the checkout and finalizes the order.
    try {
      const res = await api.post("/api/checkout/", {
        // You would pass any necessary data here, e.g., payment info
        // For this simple example, the backend handles the total.
      });
      if (res.status === 200) {
        // Clear the cart and navigate to an order success page.
        setCartItems([]);
        setTotal(0);
        navigate("/order-success");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <header style={{ borderBottom: "1px solid #ddd", paddingBottom: "20px", marginBottom: "30px" }}>
        <h1 style={{ color: "#2E8B57" }}>Your Shopping Cart</h1>
      </header>
       
      <main>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888" }}>
            <p>Your cart is empty. Add some fresh produce!</p>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #eee", borderRadius: "8px", padding: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: "0", color: "#333" }}>{item.product_name}</h4>
                    <p style={{ margin: "5px 0 0 0", color: "#666" }}>Quantity: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: "right", fontWeight: "bold", color: "#4CAF50" }}>
                    Ksh {item.price}
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} style={{ marginLeft: "20px", padding: "8px 12px", border: "none", borderRadius: "5px", backgroundColor: "#dc3545", color: "white", cursor: "pointer" }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "2px solid #2E8B57", paddingTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.5em", fontWeight: "bold" }}>
                <span>Total:</span>
                <span style={{ color: "#2E8B57" }}>Ksh {total}</span>
              </div>
              <button onClick={handleCheckout} style={{ marginTop: "20px", width: "100%", padding: "15px", fontSize: "1.2em", backgroundColor: "#2E8B57", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;