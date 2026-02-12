import React from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";

const AddNewOrder = () => {
  const { register, handleSubmit } = useForm();

  const createOrder = (data) => {
    console.log("CREATE ORDER:", data);
  };

  return (
    <Layout>
      <div className="p-6 flex justify-center">
        <div className="w-full ">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Create New Order
          </h2>

          <form
            onSubmit={handleSubmit(createOrder)}
            className="bg-white p-6 rounded-lg shadow-md space-y-5"
          >
            {/* User Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  User ID
                </label>
                <input
                  {...register("userId")}
                  placeholder="Enter user ID"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Shipping Address ID
                </label>
                <input
                  {...register("shippingAddressId")}
                  placeholder="Address ID"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>
            </div>

            {/* Coupon */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Coupon Code
              </label>
              <input
                {...register("couponCode")}
                placeholder="Optional coupon code"
                className="w-full border rounded p-2 focus:outline-blue-400"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Method
              </label>
              <select
                {...register("paymentMethod")}
                className="w-full border rounded p-2 focus:outline-blue-400"
              >
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddNewOrder;
