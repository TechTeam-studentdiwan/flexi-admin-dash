import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import { updateCategory } from "../../store/category/categoryThunks";

const EditCategory = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const category = state?.category;

  const { register, handleSubmit, reset } = useForm();

  // Redirect if refreshed (no state)
  useEffect(() => {
    if (!category) {
      navigate("/category");
    } else {
      reset({
        name: category.name,
        image: category.image,
        order: category.order,
      });
    }
  }, [category, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      data.order = Number(data.order);

      await dispatch(
        updateCategory({
          id: category._id,
          data,
        })
      ).unwrap();

      navigate("/category");
    } catch (err) {
      alert(err);
    }
  };

  if (!category) return null;

  return (
    <Layout>
      <div className=" mx-auto bg-white">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Edit Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name")}
            className="w-full border p-2 rounded"
            placeholder="Category Name"
          />

          <input
            {...register("image")}
            className="w-full border p-2 rounded"
            placeholder="Image URL"
          />

          <input
            type="number"
            {...register("order")}
            className="w-full border p-2 rounded"
            placeholder="Order"
          />

          <button className="px-3 bg-linear-to-r from-pink-500 to-purple-600 text-white py-2 rounded">
            Update Category
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditCategory;
