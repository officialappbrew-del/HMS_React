import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { addBill, setCurrency } from '../features/billingSlice';

const Billing = () => {
  const dispatch = useDispatch();
  const { bills, currency, exchangeRates } = useSelector(state => state.billing);
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    description: '',
    paymentMethod: 'cash',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const bill = {
      ...formData,
      id: Date.now(),
      amount: parseFloat(formData.amount),
      currency,
      date: new Date().toISOString(),
    };
    dispatch(addBill(bill));
    setFormData({
      patientId: '',
      amount: '',
      description: '',
      paymentMethod: 'cash',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatAmount = (amount, curr) => {
    if (curr === 'NGN') {
      return `₦${amount.toLocaleString()}`;
    }
    return `${curr} ${amount.toFixed(2)}`;
  };

  return (
    <div className="billing">
      <h2 className="text-3xl font-bold mb-6">Billing & Payments</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <select
          value={currency}
          onChange={(e) => dispatch(setCurrency(e.target.value))}
          className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm"
        >
          <option value="NGN">₦ Naira (NGN)</option>
          <option value="USD">$ US Dollar (USD)</option>
          <option value="GBP">£ British Pound (GBP)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create Bill</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount ({currency})</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="pos">POS</option>
                <option value="paystack">Paystack</option>
                <option value="flutterwave">Flutterwave</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-nigerian-gold text-white py-2 px-4 rounded-md hover:bg-yellow-600"
            >
              Create Bill
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Bills</h3>
          <div className="space-y-2">
            {bills.map(bill => (
              <div key={bill.id} className="border-b pb-2">
                <p className="font-medium">{bill.description}</p>
                <p className="text-sm text-gray-600">Patient ID: {bill.patientId}</p>
                <p className="text-sm font-bold text-nigerian-green">
                  {formatAmount(bill.amount, bill.currency)}
                </p>
                <p className="text-sm text-gray-600">{bill.paymentMethod}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;