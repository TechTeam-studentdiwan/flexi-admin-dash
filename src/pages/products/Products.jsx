import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { getProducts, deleteProduct } from "../../store/products/productThunks";
import SideDrawer from "../../components/SideDrawer";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state) => state.product);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  const filteredProducts = products?.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <div className=" mx-auto  space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Product Management
            </h2>
            <p className="text-gray-500 mt-1">
              Manage all products in your store
            </p>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />

            <button
              className="px-5 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow hover:opacity-90 transition"
              onClick={() => navigate("/add/products")}
            >
              + Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts?.map((product) => (
              <div
                key={product._id}
                onClick={() => openDetails(product)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-5 space-y-3">
                  <h4 className="font-semibold text-lg capitalize text-gray-800">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-purple-600">
                      {product.discountPrice || product.price}
                    </span>

                    {product.discountPrice && (
                      <span className="text-sm line-through text-gray-400">
                        {product.price}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>

                  <div
                    className="flex justify-end gap-4 pt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        navigate(`/edit/products/${product._id}`, {
                          state: { product },
                        })
                      }
                      className="p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && selectedProduct && (
          <SideDrawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Product Details"
          >
            <div className="space-y-8">
              {/* PRODUCT HEADER */}
              <div>
                <h2 className="text-2xl font-bold capitalize text-gray-800">
                  {selectedProduct?.name}
                </h2>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-2xl font-bold text-purple-600">
                    ₹ {selectedProduct?.discountPrice || selectedProduct?.price}
                  </span>

                  {selectedProduct?.discountPrice && (
                    <span className="text-sm line-through text-gray-400">
                      ₹ {selectedProduct?.price}
                    </span>
                  )}

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedProduct?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedProduct?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Description
                </h3>
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct?.description || "",
                  }}
                />
              </div>

              {/* BASIC INFO */}
              <div className="grid grid-cols-2 gap-6 text-sm bg-white border rounded-xl p-5">
                <div>
                  <strong>Category:</strong> {selectedProduct?.category?.name}
                </div>
                <div>
                  <strong>Fabric:</strong> {selectedProduct?.fabric}
                </div>
                <div>
                  <strong>Occasion:</strong> {selectedProduct?.occasion}
                </div>
                <div>
                  <strong>Stock:</strong> {selectedProduct?.stock ?? "N/A"}
                </div>
                <div>
                  <strong>Fit Adjustment:</strong>{" "}
                  {selectedProduct?.fitAdjustmentEnabled
                    ? "Enabled"
                    : "Disabled"}
                </div>
                {selectedProduct?.fitAdjustmentEnabled && (
                  <div>
                    <strong>Fit Fee:</strong> ₹{" "}
                    {selectedProduct?.fitAdjustmentFee}
                  </div>
                )}
                <div>
                  <strong>What's Included:</strong>{" "}
                  {selectedProduct?.whatsIncluded}
                </div>
                <div>
                  <strong>Care Instructions:</strong>{" "}
                  {selectedProduct?.careInstructions}
                </div>
              </div>

              {/* TAGS */}
              {selectedProduct?.tags?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* IMAGES */}
              {selectedProduct?.images?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Product Images
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition"
                      >
                        <img
                          src={img}
                          alt={`Product ${index}`}
                          className="h-48 w-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SIZES */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct?.sizes?.map((size) => (
                    <span
                      key={size}
                      className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* SIZE CHART */}
              {selectedProduct?.sizeChart?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Size Chart
                  </h3>

                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-purple-50 text-purple-800">
                        <tr>
                          <th className="px-4 py-3 text-left">Size</th>
                          <th className="px-4 py-3 text-left">Bust (Max)</th>
                          <th className="px-4 py-3 text-left">Waist (Max)</th>
                          <th className="px-4 py-3 text-left">Hips (Max)</th>
                          <th className="px-4 py-3 text-left">
                            Shoulder (Max)
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedProduct.sizeChart.map((item, index) => (
                          <tr
                            key={index}
                            className="border-t hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3 font-semibold text-purple-700">
                              {item.size}
                            </td>
                            <td className="px-4 py-3">{item.bust_max}</td>
                            <td className="px-4 py-3">{item.waist_max}</td>
                            <td className="px-4 py-3">{item.hips_max}</td>
                            <td className="px-4 py-3">{item.shoulder_max}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </SideDrawer>
        )}
      </div>
    </Layout>
  );
};

export default Products;
