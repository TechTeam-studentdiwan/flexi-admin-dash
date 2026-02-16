import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
// import UploadCard from "../../components/common/UploadCard";
import { addCategory } from "../../store/category/categoryThunks";
import UploadCard from "../../components/UploadCard";

const AddCategory = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
      order: 0,
    },
  });

  const imageValue = watch("image");

  const onSubmit = async (data) => {
    try {
      await dispatch(addCategory(data)).unwrap();
      reset();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Layout>
      <div>
        <div className="w-full rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Category
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 border border-gray-400 p-4 rounded-lg"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                {...register("name", { required: "Name is required" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Upload Card */}
            <UploadCard
              label="Category Image"
              value={imageValue}
              onChange={(url) => setValue("image", url)}
              folder="categories"
            />

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Display Order
              </label>
              <input
                type="number"
                placeholder="Enter display order"
                {...register("order", {
                  required: "Order is required",
                  valueAsNumber: true,
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.order && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.order.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 bg-linear-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
