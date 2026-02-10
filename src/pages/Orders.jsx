import React from "react";
import Layout from "../components/Layout";

const Orders = () => {
  const orders = [
    { id: 101, customer: "John Doe", amount: 1200, status: "Delivered" },
    { id: 102, customer: "Alice Smith", amount: 150, status: "Pending" },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          Orders
        </h2>

        <div className="bg-white shadow rounded-lg p-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-purple-50 border border-purple-200 p-4 rounded mb-3"
            >
              <h3 className="font-semibold text-purple-800">
                Order #{order.id}
              </h3>

              <p className="text-purple-600">
                Customer: {order.customer}
              </p>

              <p className="text-purple-600">
                Amount: ${order.amount}
              </p>

              <span className="text-sm text-purple-700">
                Status: {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
