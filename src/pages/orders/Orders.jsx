import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Orders = () => {
  const navigate = useNavigate();

  // Dummy data exactly shaped like your backend Order model
  const [orders, setOrders] = useState([
    {
      id: "ord_1",
      orderNumber: "ORD123456",
      userId: "user_1",
      subtotal: 350,
      discount: 50,
      fitAdjustmentFee: 30,
      deliveryFee: 15,
      total: 345,
      paymentStatus: "paid",
      orderStatus: "processing",
      couponCode: "RAMADAN15",
      trackingNumber: "TRK98765",
      estimatedDelivery: "2024-04-20",
      createdAt: "2024-04-10",
      shippingAddress: {
        fullName: "John Doe",
        phone: "123456789",
        city: "Doha",
        addressLine1: "Street 10, Building 5",
      },
      items: [
        {
          productId: "prod_1",
          productName: "Chikankari Kurta Set",
          size: "M",
          quantity: 1,
          price: 249,
        },
      ],
    },
    {
      id: "ord_2",
      orderNumber: "ORD654321",
      userId: "user_2",
      subtotal: 200,
      discount: 0,
      fitAdjustmentFee: 0,
      deliveryFee: 0,
      total: 200,
      paymentStatus: "pending",
      orderStatus: "confirmed",
      couponCode: null,
      trackingNumber: null,
      estimatedDelivery: "2024-04-25",
      createdAt: "2024-04-12",
      shippingAddress: {
        fullName: "Alice Smith",
        phone: "987654321",
        city: "Doha",
        addressLine1: "Al Sadd Area",
      },
      items: [
        {
          productId: "prod_2",
          productName: "Pakistani Suit",
          size: "L",
          quantity: 1,
          price: 200,
        },
      ],
    },
  ]);

  // ---- ACTION HANDLERS ----

  const handleEdit = (order) => {
    console.log("EDIT ORDER:", order);
    // later you can navigate to edit page
    // navigate(`/edit/order/${order.id}`)
  };

  const handleDelete = (id) => {
    console.log("DELETE ORDER ID:", id);

    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Orders
          </h2>

          <button
            className="p-2 bg-purple-400 rounded-md text-white"
            onClick={() => navigate("/add/order")}
          >
            Add New
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          {orders.length === 0 && (
            <p className="text-purple-600">No orders available</p>
          )}

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-purple-50 border border-purple-200 p-4 rounded mb-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-purple-800">
                    Order #{order.orderNumber}
                  </h3>

                  <p className="text-purple-600">
                    Customer: {order.shippingAddress.fullName}
                  </p>

                  <p className="text-purple-600">
                    Phone: {order.shippingAddress.phone}
                  </p>

                  <p className="text-purple-600">
                    City: {order.shippingAddress.city}
                  </p>

                  <p className="text-purple-600">
                    Subtotal: ${order.subtotal}
                  </p>

                  <p className="text-purple-600">
                    Discount: ${order.discount}
                  </p>

                  <p className="text-purple-600">
                    Delivery Fee: ${order.deliveryFee}
                  </p>

                  <p className="font-semibold text-purple-800">
                    Total: ${order.total}
                  </p>

                  <span className="text-sm text-purple-700 block">
                    Payment Status: {order.paymentStatus}
                  </span>

                  <span className="text-sm text-purple-700 block">
                    Order Status: {order.orderStatus}
                  </span>

                  {order.couponCode && (
                    <span className="text-sm text-purple-700 block">
                      Coupon: {order.couponCode}
                    </span>
                  )}

                  <span className="text-sm text-purple-700 block">
                    Estimated Delivery: {order.estimatedDelivery}
                  </span>

                  <div className="mt-2">
                    <h4 className="font-semibold text-purple-800">
                      Items:
                    </h4>

                    {order.items.map((item, index) => (
                      <p key={index} className="text-purple-600 text-sm">
                        - {item.productName} | Size: {item.size} | Qty:{" "}
                        {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(order)}
                    className="bg-purple-100 text-purple-700 p-2 rounded hover:bg-purple-200"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
