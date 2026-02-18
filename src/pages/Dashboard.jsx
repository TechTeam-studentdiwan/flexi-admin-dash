import React, { useEffect } from "react";
import Layout from "../components/Layout";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaBoxOpen,
  FaTicketAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardOverview } from "../store/user/userThunks";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getDashboardOverview());
  }, [dispatch]);

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-gray-500 animate-pulse">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  if (!dashboard) return null;

  const summaryData = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: <FaUsers />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: <FaShoppingCart />,
      color: "from-pink-500 to-purple-500",
    },
    {
      title: "Revenue",
      value: `   ${dashboard.totalRevenue}`,
      icon: <FaDollarSign />,
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: <FaBoxOpen />,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: <FaShoppingCart />,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Active Coupons",
      value: dashboard.activeCoupons,
      icon: <FaTicketAlt />,
      color: "from-rose-400 to-pink-500",
    },
  ];

  return (
    <Layout>
      <div className=" mx-auto space-y-10">
        <div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <p className="text-gray-500 mt-1">
            Overview of your e-commerce system
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    {item.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {item.value}
                  </h3>
                </div>

                <div
                  className={`p-4 rounded-xl text-white bg-linear-to-br ${item.color} shadow-lg text-xl`}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Recent Orders
          </h3>

          {dashboard.recentOrders.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              No recent orders available.
            </div>
          ) : (
            <div className="divide-y">
              {dashboard.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition rounded-lg px-2"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress?.phone}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                        order.orderStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                     {order.total}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
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

export default Dashboard;
