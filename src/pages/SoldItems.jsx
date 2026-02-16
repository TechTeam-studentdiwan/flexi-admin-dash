import React from "react";
import Layout from "../components/Layout";

const SoldItems = () => {
  const soldItems = [
    {
      id: 101,
      product: "Laptop",
      price: 1200,
      buyer: "John Doe",
      date: "2024-03-10",
    },
    {
      id: 102,
      product: "Headphones",
      price: 150,
      buyer: "Alice Smith",
      date: "2024-03-12",
    },
    {
      id: 103,
      product: "Keyboard",
      price: 80,
      buyer: "Robert Brown",
      date: "2024-03-14",
    },
    {
      id: 104,
      product: "Mouse",
      price: 60,
      buyer: "Emma Watson",
      date: "2024-03-15",
    },
  ];

  const totalRevenue = soldItems.reduce((total, item) => total + item.price, 0);

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">Sold Items</h2>
        <div className="bg-white shadow rounded-lg p-5 mb-6 border-t-4 border-purple-600">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">
            Sales Summary
          </h3>

          <div className="flex justify-between text-purple-800">
            <span>Total Items Sold:</span>
            <span className="font-bold">{soldItems.length}</span>
          </div>

          <div className="flex justify-between text-purple-800 mt-2">
            <span>Total Revenue:</span>
            <span className="font-bold">${totalRevenue}</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Sales History
          </h3>

          {soldItems.length === 0 ? (
            <p className="text-purple-600">No items sold yet</p>
          ) : (
            <div className="space-y-4">
              {soldItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-purple-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      {item.product}
                    </h4>

                    <p className="text-purple-600 text-sm">
                      Buyer: {item.buyer}
                    </p>

                    <p className="text-purple-500 text-sm">Date: {item.date}</p>
                  </div>

                  <div className="mt-2 md:mt-0 text-purple-800 font-bold">
                    ${item.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SoldItems;
