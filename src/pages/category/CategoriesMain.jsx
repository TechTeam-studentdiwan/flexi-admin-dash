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
  const [search, setSearch] = useState("");

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

  const filteredCategories = categories?.filter((cat) =>
    cat.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className=" mx-auto  space-y-8">

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Categories
            </h2>
            <p className="text-gray-500 mt-1">
              Manage your product categories
            </p>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />

            <button
              className="px-5 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow hover:opacity-90 transition"
              onClick={() => navigate("/add/category")}
            >
              + Add Category
            </button>
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500 animate-pulse">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No categories found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
                  <tr>
                    <th className="p-4">Category</th>
                    <th className="p-4">Display Order</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredCategories.map((cat) => (
                    <tr
                      key={cat._id}
                      onClick={() => openDetails(cat)}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >

                      <td className="p-4 flex items-center gap-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-14 w-14 rounded-xl object-cover border"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-800">
                            {cat.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {cat._id.slice(-6)}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {cat.order}
                        </span>
                      </td>

                      <td
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() =>
                              navigate(`/edit/category/${cat._id}`, {
                                state: { category: cat },
                              })
                            }
                            className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isOpen && selectedCategory && (
          <SideDrawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Category Details"
          >
            <div className="space-y-6">

              {selectedCategory.image ? (
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="w-full h-48 object-cover rounded-xl shadow"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                  No Image Available
                </div>
              )}

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedCategory.name}
                </div>

                <div>
                  <span className="font-semibold">Order:</span>{" "}
                  {selectedCategory.order}
                </div>

                <div>
                  <span className="font-semibold">ID:</span>{" "}
                  {selectedCategory._id}
                </div>

                <div>
                  <span className="font-semibold">Updated:</span>{" "}
                  {new Date(selectedCategory.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </SideDrawer>
        )}

      </div>
    </Layout>
  );
};

export default CategoriesMain;
