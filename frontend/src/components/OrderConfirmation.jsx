import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/api/orders/${orderId}/`);
      setOrder(res.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. Your order has been successfully placed.</p>
        </div>

        {/* Order Details */}
        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p><span className="font-semibold">Order ID:</span> #{order.id}</p>
              <p><span className="font-semibold">Order Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><span className="font-semibold">Delivery Address:</span> {order.delivery_address}</p>
              <p><span className="font-semibold">Phone Number:</span> {order.phone_number}</p>
            </div>
            <div>
              <p><span className="font-semibold">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </p>
              <p><span className="font-semibold">Farmer:</span> {order.farmer_name}</p>
              <p><span className="font-semibold">Farmer Phone:</span> {order.farmer_phone}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">KSH {item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-6 mb-8">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-green-600">KSH {order.total_amount}</span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="border-t pt-6 mb-8">
            <h3 className="font-semibold mb-2">Additional Notes:</h3>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Payment Information */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Payment Information</h3>
          <p className="text-blue-700 text-sm">
            You will receive an STK push notification on your phone ({order.phone_number}) to complete the payment. 
            Please enter your M-PESA PIN to complete the transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;