import React from "react";
import Layout from "../components/Layout";

const Customers = () => {
  const customers = [
    { id: 1, name: "John Doe", email: "john@mail.com" },
    { id: 2, name: "Alice Smith", email: "alice@mail.com" },
    { id: 3, name: "Robert Brown", email: "robert@mail.com" },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          Customers
        </h2>

        <div className="bg-white shadow rounded-lg p-5">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-purple-50 border border-purple-200 p-4 rounded mb-3"
            >
              <h3 className="font-semibold text-purple-800">
                {customer.name}
              </h3>
              <p className="text-purple-600">{customer.email}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Customers;
