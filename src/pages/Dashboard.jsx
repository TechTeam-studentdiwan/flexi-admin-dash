import React from "react";
import Layout from "../components/Layout";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaClipboardList,
} from "react-icons/fa";

const Dashboard = () => {
  const summaryData = [
    {
      title: "Total Users",
      value: "1,245",
      icon: <FaUsers />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Orders",
      value: "320",
      icon: <FaShoppingCart />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Revenue",
      value: "$12,450",
      icon: <FaDollarSign />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Pending Tasks",
      value: "18",
      icon: <FaClipboardList />,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-600 mb-6">Welcome to the Dashboard!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
            </div>

            <div className={`text-3xl p-3 rounded-full ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✔ New user registered</li>
            <li>✔ Order #234 completed</li>
            <li>✔ Payment received</li>
            <li>✔ Profile updated</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3">System Status</h3>
          <p className="text-gray-600">
            All systems are running smoothly. No issues detected.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
