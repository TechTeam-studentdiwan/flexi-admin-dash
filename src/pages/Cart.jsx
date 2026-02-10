import React, { useState } from "react";
import Layout from "../components/Layout";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Headphones", price: 150 },
    { id: 3, name: "Keyboard", price: 80 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;

    setProducts([
      ...products,
      {
        id: Date.now(),
        name: newProduct.name,
        price: Number(newProduct.price),
      },
    ]);

    setNewProduct({ name: "", price: "" });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
    });
  };

  const updateProduct = () => {
    setProducts(
      products.map((product) =>
        product.id === editingId
          ? { ...product, ...newProduct }
          : product
      )
    );

    setEditingId(null);
    setNewProduct({ name: "", price: "" });
  };

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          Product Management
        </h2>

        <div className="bg-white shadow rounded-lg p-5 mb-6 ">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border border-purple-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="border border-purple-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={editingId ? updateProduct : addProduct}
              className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition flex items-center justify-center gap-2"
            >
              <FaPlus />
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Product List
          </h3>

          {products.length === 0 ? (
            <p className="text-purple-600">No products available</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-purple-50 p-4 rounded-lg border border-purple-200"
                >
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      {product.name}
                    </h4>
                    <p className="text-purple-600">
                      ${product.price}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(product)}
                      className="bg-purple-100 text-purple-700 p-2 rounded hover:bg-purple-200"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
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
