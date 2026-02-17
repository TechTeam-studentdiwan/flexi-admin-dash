import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { getAllOrders } from "../../store/orders/ordersThunks";
import SideDrawer from "../../components/SideDrawer";

const Orders = () => {
  const dispatch = useDispatch();

  const { orders, loading, pagination } = useSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    dispatch(getAllOrders(filters));
  }, [dispatch, filters]);

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  const closeDetails = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          Orders Management
        </h2>

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Loading orders...</div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4 text-sm font-semibold">Customer</th>
                  <th className="p-4 text-sm font-semibold">Total</th>
                  <th className="p-4 text-sm font-semibold">Order Status</th>
                  <th className="p-4 text-sm font-semibold">Payment</th>
                  <th className="p-4 text-sm font-semibold">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => openDetails(order)}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-4 font-medium">
                      {order.shippingAddress?.fullName}
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress?.phone}
                      </div>
                    </td>

                    <td className="p-4">  {order.total}</td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SIDEBAR DETAILS */}
        {isOpen && selectedOrder && (
          <SideDrawer
            isOpen={isOpen}
            onClose={closeDetails}
            title="Order Details"
          >
            {/* Order Info */}
            <div className="space-y-3 text-sm">
              <div>
                <strong>Order ID:</strong> {selectedOrder._id}
              </div>

              <div>
                <strong>Order Status:</strong> {selectedOrder.orderStatus}
              </div>

              <div>
                <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
              </div>

              <div>
                <strong>Estimated Delivery:</strong>{" "}
                {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
              </div>

              <hr className="my-4" />

              {/* Customer */}
              <h3 className="font-semibold text-purple-700">
                Customer Details
              </h3>

              <div>
                <strong>Name:</strong> {selectedOrder.shippingAddress.fullName}
              </div>

              <div>
                <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
              </div>

              <div>
                <strong>Address:</strong>
                <div className="text-gray-600">
                  {selectedOrder.shippingAddress.addressLine1}
                  <br />
                  {selectedOrder.shippingAddress.addressLine2}
                  <br />
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state}
                  <br />
                  {selectedOrder.shippingAddress.country}
                </div>
              </div>

              <hr className="my-4" />

              {/* Items */}
              <h3 className="font-semibold text-purple-700">Ordered Items</h3>

              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="border p-3 rounded bg-gray-50">
                    <div className="font-medium">{item.name}</div>
                    <div>Size: {item.size}</div>
                    <div>Qty: {item.quantity}</div>
                    <div>Price:   {item.discountPrice || item.price}</div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* Pricing Breakdown */}
              <h3 className="font-semibold text-purple-700">Payment Summary</h3>

              <div>Subtotal:   {selectedOrder.subtotal}</div>
              <div>Discount:   {selectedOrder.discount}</div>
              <div>Delivery Fee:   {selectedOrder.deliveryFee}</div>
              <div className="font-bold text-lg">
                Total:   {selectedOrder.total}
              </div>

              {selectedOrder.couponCode && (
                <div>
                  <strong>Coupon:</strong> {selectedOrder.couponCode}
                </div>
              )}
            </div>
          </SideDrawer>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
