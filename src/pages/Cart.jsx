import React, { useState } from "react";
import Layout from "../components/Layout";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 120,
      quantity: 2,
    },
    {
      id: 2,
      name: "Product 2",
      price: 80,
      quantity: 1,
    },
    {
      id: 3,
      name: "Product 3",
      price: 150,
      quantity: 3,
    },
  ]);

  const updateQuantity = (id, type) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "increase"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">${item.price}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, "decrease")}
                    className="p-2 bg-gray-100 rounded"
                  >
                    <FaMinus />
                  </button>

                  <span className="px-2">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, "increase")}
                    className="p-2 bg-gray-100 rounded"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="font-bold">
                  ${item.price * item.quantity}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white shadow rounded-lg p-5 h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${totalAmount}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$10</span>
            </div>

            <div className="flex justify-between mb-4 font-bold">
              <span>Total</span>
              <span>${totalAmount + 10}</span>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
