import React from "react";

const Receipt = ({ payment }) => {
  if (!payment) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Payment Receipt</h2>
      <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
      <p><strong>Amount:</strong> KSH {payment.amount}</p>
      <p><strong>Phone:</strong> {payment.phone}</p>
      <p><strong>Status:</strong> {payment.status}</p>
      <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default Receipt;
