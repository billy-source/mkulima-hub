import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import Receipt from '../components/Receipt';
import PaymentHistory from '../components/PaymentHistory';

const MakePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from Cart.jsx
  const { cartItems = [], total = 0, deliveryAddress = "", phoneNumber = "", notes = "" } = location.state || {};

  const [activeTab, setActiveTab] = useState('pay');
  const [completedPayment, setCompletedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePaymentSubmit = async (data) => {
    setLoading(true);
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock receipt
    const payment = {
      ...data,
      id: Date.now().toString(),
      transactionId: 'TX' + Date.now().toString().slice(-6),
      amount: total,
      deliveryAddress,
      phoneNumber,
      notes,
      items: cartItems,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setCompletedPayment(payment);
    setActiveTab('receipt');
    setLoading(false);
    console.log('Payment processed:', payment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Back to Cart
        </button>

        {/* Order Summary Before Payment */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Order Summary</h2>
          <p><strong>Delivery Address:</strong> {deliveryAddress}</p>
          <p><strong>Phone Number:</strong> {phoneNumber}</p>
          <p><strong>Notes:</strong> {notes || "No additional notes"}</p>
          <p className="mt-2 font-semibold">Total: KSH {total}</p>

          <h3 className="text-lg font-semibold mt-4">Items:</h3>
          <ul className="list-disc pl-6">
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.product_name} - {item.quantity} x KSH {item.product_price} = KSH {item.quantity * item.product_price}
              </li>
            ))}
          </ul>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pay')}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                activeTab === 'pay'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Make Payment
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                activeTab === 'history'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Payment History
            </button>
            {completedPayment && (
              <button
                onClick={() => setActiveTab('receipt')}
                className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                  activeTab === 'receipt'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Receipt
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pay' && (
          <PaymentForm onSubmit={handlePaymentSubmit} loading={loading} />
        )}

        {activeTab === 'history' && <PaymentHistory />}

        {activeTab === 'receipt' && completedPayment && (
          <Receipt payment={completedPayment} />
        )}
      </div>
    </div>
  );
};

export default MakePayment;
