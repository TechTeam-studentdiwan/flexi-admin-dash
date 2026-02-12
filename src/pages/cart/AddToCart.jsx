import React from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";

const AddToCart = () => {
  const { register, handleSubmit } = useForm();

  const onAdd = (data) => {
    console.log("ADD TO CART:", data);
  };

  const onUpdate = (data) => {
    console.log("UPDATE CART:", data);
  };

  const onRemove = (data) => {
    console.log("REMOVE FROM CART:", data);
  };

  return (
    <Layout>
      <div className="p-6  mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-gray-700">Cart Management</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ADD TO CART */}
          <form
            onSubmit={handleSubmit(onAdd)}
            className="bg-white p-5 rounded-lg shadow space-y-6 col-span-2"
          >
            <h3 className="text-lg font-semibold text-purple-600">
              Add To Cart
            </h3>

            <div className="grid gap-3">
              <input
                {...register("userId")}
                placeholder="User ID"
                className="w-full border rounded p-2"
              />

              <input
                {...register("productId")}
                placeholder="Product ID"
                className="w-full border rounded p-2"
              />

              <input
                {...register("size")}
                placeholder="Size (S, M, L)"
                className="w-full border rounded p-2"
              />

              <input
                type="number"
                {...register("quantity")}
                placeholder="Quantity"
                className="w-full border rounded p-2"
              />
            </div>

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddToCart;
