import React, { useState } from "react";
import Layout from "../../components/Layout";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  // Dummy cart data shaped like backend response
  const [cart, setCart] = useState({
    userId: "user_1",
    items: [
      {
        productId: "prod_1",
        productName: "Chikankari Kurta Set",
        productImage: "https://via.placeholder.com/100",
        price: 249,
        size: "M",
        quantity: 1,
        fitAdjustment: {
          profileName: "Me",
          fee: 30,
        },
        itemTotal: 279,
      },
      {
        productId: "prod_2",
        productName: "Pakistani Lawn Suit",
        productImage: "https://via.placeholder.com/100",
        price: 329,
        size: "L",
        quantity: 2,
        fitAdjustment: null,
        itemTotal: 658,
      },
    ],
    total: 937,
  });

  const [coupon, setCoupon] = useState("");

  // -------- HANDLERS --------

  const updateQuantity = (productId, size, type) => {
    console.log("UPDATE QUANTITY:", { productId, size, type });

    const updatedItems = cart.items.map((item) => {
      if (item.productId === productId && item.size === size) {
        const newQty =
          type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

        return {
          ...item,
          quantity: newQty,
          itemTotal:
            newQty * item.price + (item.fitAdjustment?.fee || 0) * newQty,
        };
      }
      return item;
    });

    recalcCart(updatedItems);
  };

  const removeItem = (productId, size) => {
    console.log("REMOVE ITEM:", { productId, size });

    const updatedItems = cart.items.filter(
      (item) => !(item.productId === productId && item.size === size),
    );

    recalcCart(updatedItems);
  };

  const applyCoupon = () => {
    console.log("APPLY COUPON:", {
      code: coupon,
      cartTotal: cart.total,
      userId: cart.userId,
    });
  };

  const recalcCart = (items) => {
    const newTotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

    setCart({
      ...cart,
      items,
      total: newTotal,
    });
  };

  const checkout = () => {
    console.log("PROCEED TO CHECKOUT:", {
      userId: cart.userId,
      cart,
    });

    // navigate("/checkout");
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Cart Management
          </h2>

          <button
            className="p-2 bg-purple-400 rounded-md text-white"
            onClick={() => navigate("/add/cart")}
          >
            Add New
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-purple-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-purple-600 text-white p-2 rounded"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CART ITEMS */}
            <div className="md:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId + item.size}
                  className="bg-white p-4 rounded shadow flex items-center gap-4"
                >
                  <img
                    src={item.productImage}
                    alt=""
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-800">
                      {item.productName}
                    </h3>

                    <p className="text-purple-600">Size: {item.size}</p>

                    <p className="text-purple-600">Price: ${item.price}</p>

                    {item.fitAdjustment && (
                      <p className="text-sm text-purple-500">
                        Fit Adjustment: {item.fitAdjustment.profileName} (+$
                        {item.fitAdjustment.fee})
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, "dec")
                        }
                        className="p-1 bg-purple-100 rounded"
                      >
                        <FaMinus />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, "inc")
                        }
                        className="p-1 bg-purple-100 rounded"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-purple-800">
                      ${item.itemTotal}
                    </p>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="mt-2 bg-red-100 text-red-600 p-2 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CART SUMMARY */}
            <div className="bg-white p-5 rounded shadow h-fit">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 text-purple-700">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{cart.items.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cart.total}</span>
                </div>
              </div>

              <div className="mt-4">
                <input
                  placeholder="Coupon Code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border p-2 w-full rounded"
                />

                <button
                  onClick={applyCoupon}
                  className="w-full bg-purple-200 text-purple-800 p-2 mt-2 rounded"
                >
                  Apply Coupon
                </button>
              </div>

              <button
                onClick={checkout}
                className="w-full bg-purple-600 text-white p-2 mt-4 rounded"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
