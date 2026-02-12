import React from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";

const AddProducts = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("PRODUCT SUBMIT DATA:", data);
    reset();
  };

  return (
    <Layout>
      <div className="p-6 flex justify-center">
        <div className="w-full ">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">
            Add New Product
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-md space-y-5"
          >
            {/* Basic Info Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter product name"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  {...register("category")}
                  placeholder="e.g. Shirts"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Product description..."
                className="w-full border rounded p-2 focus:outline-blue-400"
                rows={3}
              />
            </div>

            {/* Pricing Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price
                </label>
                <input
                  type="number"
                  {...register("price")}
                  placeholder="Actual price"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  {...register("discountPrice")}
                  placeholder="Discounted price"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>
            </div>

            {/* Extra Details */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fabric
                </label>
                <input
                  {...register("fabric")}
                  placeholder="e.g Cotton"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Occasion
                </label>
                <input
                  {...register("occasion")}
                  placeholder="e.g Casual"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sizes
                </label>
                <input
                  {...register("sizes")}
                  placeholder="S, M, L, XL"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded">
              <input
                type="checkbox"
                {...register("fitAdjustmentEnabled")}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">
                Fit Adjustment Enabled
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProducts;
