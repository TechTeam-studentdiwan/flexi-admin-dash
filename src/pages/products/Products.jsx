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
            <div className="space-y-6">
              <h2 className="text-2xl font-bold capitalize text-gray-800">
                {selectedProduct.name}
              </h2>

              <div className="flex gap-4 items-center">
                <span className="text-2xl font-bold text-purple-600">
                     {selectedProduct.discountPrice || selectedProduct.price}
                </span>

                {selectedProduct.discountPrice && (
                  <span className="line-through text-gray-400">
                       {selectedProduct.price}
                  </span>
                )}
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedProduct.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedProduct.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: selectedProduct.description || "",
                }}
              />
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>Fabric: {selectedProduct.fabric}</div>
                <div>Occasion: {selectedProduct.occasion}</div>
                <div>Stock: {selectedProduct.stock}</div>
                <div>Category: {selectedProduct.category?.name}</div>
              </div>

              {selectedProduct.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
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
