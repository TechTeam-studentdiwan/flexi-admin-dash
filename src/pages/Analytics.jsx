import React from "react";
import Layout from "../components/Layout";
import { FaChartLine, FaBoxOpen, FaDollarSign, FaShoppingBag } from "react-icons/fa";

const Analytics = () => {
  // Dummy analytics data
  const analytics = {
    totalProducts: 12,
    totalSales: 48,
    totalRevenue: 5600,
    todaySales: 5,
  };

  const recentSales = [
    { id: 1, product: "Laptop", amount: 1200, date: "2024-03-16" },
    { id: 2, product: "Mouse", amount: 60, date: "2024-03-16" },
    { id: 3, product: "Keyboard", amount: 80, date: "2024-03-15" },
    { id: 4, product: "Headphones", amount: 150, date: "2024-03-14" },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          
          <div className="bg-white shadow rounded-lg p-5 border-t-4 border-purple-600">
            <div className="flex items-center gap-3 text-purple-700">
              <FaBoxOpen className="text-2xl" />
              <h3 className="font-semibold">Total Products</h3>
            </div>
            <p className="text-3xl font-bold text-purple-800 mt-3">
              {analytics.totalProducts}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-5 border-t-4 border-purple-600">
            <div className="flex items-center gap-3 text-purple-700">
              <FaShoppingBag className="text-2xl" />
              <h3 className="font-semibold">Total Sales</h3>
            </div>
            <p className="text-3xl font-bold text-purple-800 mt-3">
              {analytics.totalSales}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-5 border-t-4 border-purple-600">
            <div className="flex items-center gap-3 text-purple-700">
              <FaDollarSign className="text-2xl" />
              <h3 className="font-semibold">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-purple-800 mt-3">
              ${analytics.totalRevenue}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-5 border-t-4 border-purple-600">
            <div className="flex items-center gap-3 text-purple-700">
              <FaChartLine className="text-2xl" />
              <h3 className="font-semibold">Today Sales</h3>
            </div>
            <p className="text-3xl font-bold text-purple-800 mt-3">
              {analytics.todaySales}
            </p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Recent Sales
          </h3>

          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white border border-purple-200 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold text-purple-800">
                    {sale.product}
                  </h4>
                  <p className="text-purple-600 text-sm">
                    Date: {sale.date}
                  </p>
                </div>

                <div className="text-purple-800 font-bold">
                  ${sale.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
