import React, { useState } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();

  // Backend shaped dummy products
  const [products, setProducts] = useState([
    {
      id: "prod_1",
      name: "Chikankari Kurta Set",
      description: "Beautiful hand embroidered kurta set",
      price: 349,
      discountPrice: 249,
      category: "Chikankari",
      fabric: "Cotton",
      occasion: "Ramadan",
      sizes: ["S", "M", "L"],
      fitAdjustmentEnabled: true,
      stock: 20,
    },
    {
      id: "prod_2",
      name: "Pakistani Lawn Suit",
      description: "Elegant embroidered lawn suit",
      price: 449,
      discountPrice: 329,
      category: "Pakistani Suits",
      fabric: "Lawn",
      occasion: "Eid",
      sizes: ["M", "L", "XL"],
      fitAdjustmentEnabled: true,
      stock: 15,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    fabric: "",
    occasion: "",
    sizes: "",
    stock: "",
    fitAdjustmentEnabled: false,
  });

  const [editingId, setEditingId] = useState(null);

  const deleteProduct = (id) => {
    console.log("DELETE PRODUCT ID:", id);
    setProducts(products.filter((product) => product.id !== id));
  };

  const startEdit = (product) => {
    setEditingId(product.id);

    setNewProduct({
      ...product,
      sizes: product.sizes.join(","),
    });
  };
  
  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Product Management
          </h2>

          <button
            className="p-2 bg-linear-to-r from-pink-500 to-purple-500 rounded-md text-white"
            onClick={() => navigate("/add/products")}
          >
            Add New
          </button>
        </div>

        {/* LIST SECTION */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Product List
          </h3>

          {products.length === 0 ? (
            <p>No products available</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg border"
                >
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      {product.name}
                    </h4>

                    <p className="text-purple-600">Price: ${product.price}</p>

                    {product.discountPrice && (
                      <p className="text-purple-600">
                        Discount: ${product.discountPrice}
                      </p>
                    )}

                    <p className="text-sm">Category: {product.category}</p>

                    <p className="text-sm">Fabric: {product.fabric}</p>

                    <p className="text-sm">Sizes: {product.sizes.join(", ")}</p>

                    <p className="text-sm">Stock: {product.stock}</p>

                    <p className="text-sm">
                      Fit Adjustment:{" "}
                      {product.fitAdjustmentEnabled ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(product)}
                      className="bg-purple-100 p-2 rounded"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-100 p-2 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
