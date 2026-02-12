import React, { useMemo } from "react";
import Layout from "../components/Layout";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaBoxOpen,
  FaTicketAlt,
} from "react-icons/fa";

const Dashboard = () => {
  // ---- Backend-shaped dummy data ----

  const users = [
    { id: "u1" },
    { id: "u2" },
    { id: "u3" },
  ];

  const products = [
    { id: "p1" },
    { id: "p2" },
    { id: "p3" },
    { id: "p4" },
  ];

  const coupons = [
    { id: "c1", isActive: true },
    { id: "c2", isActive: false },
  ];

  const orders = [
    {
      id: "ord1",
      orderNumber: "ORD123456",
      total: 349,
      paymentStatus: "paid",
      orderStatus: "delivered",
      createdAt: "2024-04-10",
    },
    {
      id: "ord2",
      orderNumber: "ORD654321",
      total: 200,
      paymentStatus: "pending",
      orderStatus: "processing",
      createdAt: "2024-04-12",
    },
  ];

  // ---- Derived Data ----

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "processing"
  ).length;

  const activeCoupons = coupons.filter((c) => c.isActive).length;

  const summaryData = [
    {
      title: "Total Users",
      value: users.length,
      icon: <FaUsers />,
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <FaShoppingCart />,
    },
    {
      title: "Revenue",
      value: `$${totalRevenue}`,
      icon: <FaDollarSign />,
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <FaBoxOpen />,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <FaShoppingCart />,
    },
    {
      title: "Active Coupons",
      value: activeCoupons,
      icon: <FaTicketAlt />,
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          Admin Dashboard
        </h2>

        <p className="text-purple-600 mb-6">
          Overview of your e-commerce system
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

        {/* RECENT ORDERS + SYSTEM STATUS */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              Recent Orders
            </h3>

            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="bg-purple-50 p-3 rounded flex justify-between"
                >
                  <div>
                    <p className="font-semibold text-purple-800">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-purple-600">
                      Status: {order.orderStatus}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-purple-800">
                      ${order.total}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.createdAt}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              System Status
            </h3>

            <div className="space-y-3 text-purple-700">
              <p className="bg-green-50 p-3 rounded">
                ✔ Backend API: Running
              </p>
              <p className="bg-green-50 p-3 rounded">
                ✔ Database: Connected
              </p>
              <p className="bg-green-50 p-3 rounded">
                ✔ Payment Gateway: Active
              </p>
              <p className="bg-green-50 p-3 rounded">
                ✔ No critical errors detected
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
