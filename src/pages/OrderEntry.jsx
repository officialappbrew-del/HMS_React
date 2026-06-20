import React from 'react';
import OrderEntrySystem from './OrderEntrySystem';

const OrderEntry = () => {
  return (
    <div className="order-entry-page min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6">
        {/* The OrderEntrySystem component handles its own layout, so we just render it here */}
        <OrderEntrySystem />
      </div>
    </div>
  );
};

export default OrderEntry;

