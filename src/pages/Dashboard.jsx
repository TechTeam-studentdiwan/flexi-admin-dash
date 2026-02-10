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
    },
    {
      title: "Total Orders",
      value: "320",
      icon: <FaShoppingCart />,
    },
    {
      title: "Revenue",
      value: "$12,450",
      icon: <FaDollarSign />,
    },
    {
      title: "Pending Tasks",
      value: "18",
      icon: <FaClipboardList />,
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          Dashboard
        </h2>

        <p className="text-purple-600 mb-6">
          Welcome to your admin dashboard!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-5 flex items-center justify-between border-t-4 border-purple-600"
            >
              <div>
                <p className="text-purple-600">{item.title}</p>
                <h3 className="text-2xl font-bold text-purple-800 mt-1">
                  {item.value}
                </h3>
              </div>

              <div className="text-3xl p-3 rounded-full bg-purple-100 text-purple-700">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              Recent Activity
            </h3>

            <ul className="space-y-2 text-purple-700">
              <li className="bg-purple-50 p-2 rounded">
                ✔ New user registered
              </li>
              <li className="bg-purple-50 p-2 rounded">
                ✔ Order #234 completed
              </li>
              <li className="bg-purple-50 p-2 rounded">
                ✔ Payment received
              </li>
              <li className="bg-purple-50 p-2 rounded">
                ✔ Profile updated
              </li>
            </ul>
          </div>


          <div className="bg-white rounded-lg shadow p-5 ">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              System Status
            </h3>

            <p className="text-purple-700 bg-purple-50 p-3 rounded">
              All systems are running smoothly. No issues detected.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
