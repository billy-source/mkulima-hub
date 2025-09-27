import React, { useState } from "react";

const PaymentHistory = () => {
  const [history] = useState([]); // You can later fetch from backend

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Payment History</h2>
      {history.length === 0 ? (
        <p>No previous payments found.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((p) => (
            <li key={p.id} className="border-b py-2">
              {p.transactionId} - KSH {p.amount} - {p.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
