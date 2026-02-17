import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  deleteCategory,
} from "../../store/category/categoryThunks";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import SideDrawer from "../../components/SideDrawer";

const CategoriesMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading } = useSelector((state) => state.category);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await dispatch(deleteCategory(id));
    }
  };

  const openDetails = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const closeDetails = () => {
    setSelectedCategory(null);
    setIsOpen(false);
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">
            Categories
          </h2>

          <button
            className="px-4 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-sm shadow hover:opacity-90 transition"
            onClick={() => navigate("/add/category")}
          >
             Add New
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No categories found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600">
                    Order
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    onClick={() => openDetails(cat)}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* Name + Image */}
                    <td className="p-4 font-medium text-gray-700 flex items-center gap-3">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-12 w-12 object-cover rounded-full border"
                        />
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full text-gray-400 text-xs">
                          No Img
                        </div>
                      )}
                      {cat.name}
                    </td>

                    {/* Order */}
                    <td className="p-4 text-gray-600">
                      {cat.order}
                    </td>

                    {/* Actions */}
                    <td
                      className="p-4 text-right space-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          navigate(`/edit/category/${cat._id}`, {
                            state: { category: cat },
                          })
                        }
                        className="p-2 hover:text-purple-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sidebar Drawer */}
        {isOpen && selectedCategory && (
          <SideDrawer
            isOpen={isOpen}
            onClose={closeDetails}
            title="Category Details"
          >
            <div className="space-y-4 text-sm">

              {/* Image */}
              {selectedCategory.image ? (
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="w-full h-40 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400">
                  No Image
                </div>
              )}

              <div>
                <strong>Name:</strong> {selectedCategory.name}
              </div>

              <div>
                <strong>Order:</strong> {selectedCategory.order}
              </div>

              <div>
                <strong>ID:</strong> {selectedCategory._id}
              </div>

              <div>
                <strong>Updated At:</strong>{" "}
                {new Date(selectedCategory.updatedAt).toLocaleString()}
              </div>
            </div>
          </SideDrawer>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesMain;
