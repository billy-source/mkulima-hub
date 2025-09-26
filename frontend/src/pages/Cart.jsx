import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart/");
      setCartItems(res.data?.items || []);
      setTotal(res.data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/remove/${itemId}/`);
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedItems);
      const newTotal = updatedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(newTotal);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.post(`/api/cart/add/`, { product_id: itemId, quantity: newQuantity });
      const updatedItems = cartItems.map((item) =>
        item.product_id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      const newTotal = updatedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(newTotal);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim() || !phoneNumber.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Step 1: Create order on backend
      const orderData = {
        delivery_address: deliveryAddress,
        phone_number: phoneNumber,
        notes: notes,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: total + 200, // include delivery fee
      };

      const res = await api.post("/api/orders/create/", orderData);

      if (res.status === 201) {
        const { order_id, amount, email } = res.data; // backend returns Paystack info

        // Step 2: Initialize Paystack payment
        const handler = window.PaystackPop.setup({
          key: process.env.REACT_APP_PAYSTACK_KEY,
          email: email,
          amount: amount * 100, // Paystack expects kobo
          ref: order_id,
          onClose: function () {
            alert("Payment window closed. Complete your payment to confirm order.");
          },
          callback: async function (response) {
            // Step 3: Verify payment on backend
            try {
              const verifyRes = await api.post(`/api/payments/verify/`, {
                reference: response.reference,
                order_id: order_id,
              });

              if (verifyRes.data.status === "success") {
                alert("Payment successful! Order confirmed.");
                setCartItems([]);
                setTotal(0);
                navigate(`/order-confirmation/${order_id}`);
              } else {
                alert("Payment verification failed. Contact support.");
              }
            } catch (err) {
              console.error("Payment verification error:", err);
              alert("Payment verification failed. Try again.");
            }
          },
        });

        handler.openIframe();
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Shopping Cart</h1>

      {cartItems?.length === 0 ? (
        <div className="text-center py-12">
          <p className="mt-4 text-xl text-gray-600">Your cart is empty</p>
          <button
            onClick={() => navigate("/marketplace")}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      {item.image && <img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />}
                      <div>
                        <h3 className="font-semibold">{item.product_name}</h3>
                        <p className="text-gray-600">KSH {item.price} each</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KSH {item.price * item.quantity}</p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>KSH {total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>KSH 200</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>KSH {total + 200}</span>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your delivery address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+254..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Any special instructions..."
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition"
                    >
                      Pay & Place Order
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
