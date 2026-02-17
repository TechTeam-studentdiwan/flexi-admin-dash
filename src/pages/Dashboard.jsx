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

  const { dashboard, loading } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(getDashboardOverview());
  }, [dispatch]);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading dashboard...</div>
      </Layout>
    );
  }

  if (!dashboard) return null;

  const summaryData = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: <FaUsers />,
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: <FaShoppingCart />,
    },
    {
      title: "Revenue",
      value: dashboard.totalRevenue,
      icon: <FaDollarSign />,
    },
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: <FaBoxOpen />,
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: <FaShoppingCart />,
    },
    {
      title: "Active Coupons",
      value: dashboard.activeCoupons,
      icon: <FaTicketAlt />,
    },
  ];

  return (
    <Layout>
      <div className="">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          Admin Dashboard
        </h2>

        <p className="text-purple-600 mb-6">
          dashboard of your e-commerce system
        </p>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* RECENT ORDERS */}
        <div className="mt-8 bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">
            Recent Orders
          </h3>

          {dashboard.recentOrders.length === 0 ? (
            <p>No recent orders</p>
          ) : (
            <ul className="space-y-3">
              {dashboard.recentOrders.map((order) => (
                <li
                  key={order._id}
                  className="bg-white p-3 rounded flex justify-between border"
                >
                  <div>
                    <p className="font-semibold text-purple-800">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-sm text-purple-600">
                      {order.shippingAddress?.phone}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {order.orderStatus}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-purple-800">
                      {order.total}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
