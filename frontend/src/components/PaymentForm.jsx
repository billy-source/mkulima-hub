import React, { useState, useEffect } from "react";

const PaymentForm = ({ onSubmit, loading, initialAmount }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    paymentMethod: "mpesa",
  });

  // Update amount whenever initialAmount changes
  useEffect(() => {
    if (initialAmount) {
      setFormData((prev) => ({ ...prev, amount: initialAmount }));
    }
  }, [initialAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-4"
    >
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          name="name"
          className="w-full border rounded-lg p-2"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Amount (KSH)</label>
        <input
          type="number"
          name="amount"
          className="w-full border rounded-lg p-2"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Payment Method</label>
        <select
          name="paymentMethod"
          className="w-full border rounded-lg p-2"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="mpesa">M-Pesa</option>
          <option value="card">Card</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default PaymentForm;
