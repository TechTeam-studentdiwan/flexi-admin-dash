import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../store/products/productThunks";
import RichTextEditor from "../../components/AdminEditor";
import UploadCard from "../../components/UploadCard";
// import UploadCard from "../../components/common/UploadCard";

const AddProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, control } = useForm();
  const { categories } = useSelector((state) => state.category);

  const [images, setImages] = useState([]);

  // ✅ Add image
  const handleAddImage = (url) => {
    if (!url) return;

    setImages((prev) => [
      ...prev,
      { url, index: prev.length },
    ]);
  };

  // ✅ Remove image
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) =>
      prev
        .filter((_, i) => i !== indexToRemove)
        .map((img, i) => ({ ...img, index: i }))
    );
  };

  // ✅ Change index manually
  const handleIndexChange = (oldIndex, newIndex) => {
    const updated = [...images];
    const movedItem = updated.splice(oldIndex, 1)[0];
    updated.splice(newIndex, 0, movedItem);

    const reIndexed = updated.map((img, i) => ({
      ...img,
      index: i,
    }));

    setImages(reIndexed);
  };

  const onSubmit = async (data) => {
    try {
      data.price = Number(data.price);
      data.discountPrice = Number(data.discountPrice);
      data.sizes = data.sizes.split(",").map((s) => s.trim());

      // ✅ Send only URLs sorted by index
      data.images = images
        .sort((a, b) => a.index - b.index)
        .map((img) => img.url);

      await dispatch(addProduct(data)).unwrap();
      reset();
      setImages([]);
      navigate("/products");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Add New Product
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-gray-400 p-6 rounded-lg space-y-5"
        >
          {/* Product Name */}
          <input
            {...register("name")}
            placeholder="Product Name"
            className="w-full border p-2 rounded"
          />

          {/* Category */}
          <select
            {...register("category", { required: true })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Description */}
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                minHeight={250}
              />
            )}
          />

          {/* Multi Image Upload Section */}
          <div>
            {/* Upload Button */}
            <UploadCard
              label="Product Images"
              onChange={handleAddImage}
              folder="products"
            />

            {/* Image Preview Grid */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-2 relative bg-gray-50"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-32 w-full object-cover rounded"
                  />

                  {/* Index */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold">
                      #{index}
                    </span>

                    <select
                      value={index}
                      onChange={(e) =>
                        handleIndexChange(
                          index,
                          Number(e.target.value)
                        )
                      }
                      className="border text-sm"
                    >
                      {images.map((_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <input
            type="number"
            {...register("price")}
            placeholder="Price"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            {...register("discountPrice")}
            placeholder="Discount Price"
            className="w-full border p-2 rounded"
          />

          <input
            {...register("fabric")}
            placeholder="Fabric"
            className="w-full border p-2 rounded"
          />

          <input
            {...register("occasion")}
            placeholder="Occasion"
            className="w-full border p-2 rounded"
          />

          <input
            {...register("sizes")}
            placeholder="S, M, L"
            className="w-full border p-2 rounded"
          />

          <button className="bg-linear-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded">
            Save Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProducts;
