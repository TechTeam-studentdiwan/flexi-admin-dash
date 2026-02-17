import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import { getProducts, deleteProduct } from "../../store/products/productThunks";
import SideDrawer from "../../components/SideDrawer";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state) => state.product);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete product?")) {
      await dispatch(deleteProduct(id));
    }
  };

  const openDetails = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeDetails = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-800">
            Product Management
          </h2>

          <button
            className="px-4 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded"
            onClick={() => navigate("/add/products")}
          >
            Add New
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white shadow rounded-lg p-5 space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex justify-between border p-4 rounded hover:bg-gray-50 cursor-pointer transition"
                onClick={() => openDetails(product)}
              >
                <div>
                  <h4 className="font-semibold capitalize">{product.name}</h4>
                  <p>₹ {product.discountPrice || product.price}</p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>

                <div
                  className="flex gap-3 items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="p-2 rounded"
                    onClick={() =>
                      navigate(`/edit/products/${product._id}`, {
                        state: { product },
                      })
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    className=" p-2 rounded"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && selectedProduct && (
          <SideDrawer
            isOpen={isOpen}
            onClose={closeDetails}
            title="Product Details"
          >
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {selectedProduct?.name}
            </h2>

            <div
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html: selectedProduct?.description || "",
              }}
            />

            <div className="space-y-2 text-sm">
              <p>
                <strong>Category:</strong> {selectedProduct?.category?.name}
              </p>

              <p>
                <strong>Price:</strong> ₹ {selectedProduct?.price}
              </p>

              <p>
                <strong>Discount Price:</strong> ₹{" "}
                {selectedProduct?.discountPrice}
              </p>

              <p>
                <strong>Fabric:</strong> {selectedProduct?.fabric}
              </p>

              <p>
                <strong>Occasion:</strong> {selectedProduct?.occasion}
              </p>

              <p>
                <strong>Stock:</strong> {selectedProduct?.stock ?? "N/A"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selectedProduct?.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedProduct?.isActive ? "Active" : "Inactive"}
                </span>
              </p>

              <p>
                <strong>Fit Adjustment:</strong>{" "}
                {selectedProduct?.fitAdjustmentEnabled ? "Enabled" : "Disabled"}
              </p>

              {selectedProduct?.fitAdjustmentEnabled && (
                <p>
                  <strong>Fit Adjustment Fee:</strong> ₹{" "}
                  {selectedProduct?.fitAdjustmentFee}
                </p>
              )}

              <p>
                <strong>What's Included:</strong>{" "}
                {selectedProduct?.whatsIncluded}
              </p>

              <p>
                <strong>Care Instructions:</strong>{" "}
                {selectedProduct?.careInstructions}
              </p>
            </div>

            {selectedProduct?.tags?.length > 0 && (
              <div className="mt-6">
                <strong>Tags:</strong>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedProduct.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct?.images?.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Images</h4>

                <div className="grid grid-cols-2 gap-4">
                  {selectedProduct.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden bg-gray-50"
                    >
                      <img
                        src={img}
                        alt={`Product ${index}`}
                        className="h-40 w-full object-cover"
                      />

                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        #{index}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <strong>Sizes:</strong>
              <div className="flex gap-2 mt-2 flex-wrap">
                {selectedProduct?.sizes?.map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 bg-purple-100 rounded-full text-sm"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {selectedProduct?.sizeChart?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Size Chart</h3>

                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-purple-100 text-purple-800">
                      <tr>
                        <th className="px-4 py-2">Size</th>
                        <th className="px-4 py-2">Bust (Max)</th>
                        <th className="px-4 py-2">Waist (Max)</th>
                        <th className="px-4 py-2">Hips (Max)</th>
                        <th className="px-4 py-2">Shoulder (Max)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.sizeChart.map((item, index) => (
                        <tr
                          key={index}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-2 font-semibold text-purple-700">
                            {item.size}
                          </td>
                          <td className="px-4 py-2">{item.bust_max}</td>
                          <td className="px-4 py-2">{item.waist_max}</td>
                          <td className="px-4 py-2">{item.hips_max}</td>
                          <td className="px-4 py-2">{item.shoulder_max}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </SideDrawer>
        )}
      </div>
    </Layout>
  );
};

export default Products;
