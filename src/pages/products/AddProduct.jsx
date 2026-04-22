import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../store/products/productThunks";
import RichTextEditor from "../../components/AdminEditor";
import UploadCard from "../../components/UploadCard";
import { usePopup } from "../../components/PopupMessage/PopupContext";

const AddProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, control, watch } = useForm();
  const { popMessage } = usePopup();
  const { categories } = useSelector((state) => state.category);

  const fitAdjustmentEnabled = watch("fitAdjustmentEnabled");
  const sizesValue = watch("sizes");

  const [images, setImages] = useState([]);

  const handleAddImage = (url) => {
    if (!url) return;
    setImages((prev) => [...prev, { url, index: prev.length }]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) =>
      prev
        .filter((_, i) => i !== indexToRemove)
        .map((img, i) => ({ ...img, index: i }))
    );
  };

  const handleIndexChange = (oldIndex, newIndex) => {
    const updated = [...images];
    const movedItem = updated.splice(oldIndex, 1)[0];
    updated.splice(newIndex, 0, movedItem);
    setImages(updated.map((img, i) => ({ ...img, index: i })));
  };

  const onSubmit = async (data) => {
    try {
      data.price = Number(data.price);
      data.discountPrice = Number(data.discountPrice);
      data.stock = Number(data.stock);
      data.estimatedDeliveryDays = Number(data.estimatedDeliveryDays);

      data.fitAdjustmentEnabled = Boolean(data.fitAdjustmentEnabled);
      data.fitAdjustmentFee = data.fitAdjustmentEnabled
        ? Number(data.fitAdjustmentFee)
        : 0;

      data.codAvailable = Boolean(data.codAvailable);
      data.isActive = data.isActive !== false;

      if (data.tags) {
        data.tags = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      const sizesArray = data.sizes
        ? data.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      data.sizes = sizesArray;

      if (data.sizeChart) {
        data.sizeChart = sizesArray.map((size, index) => ({
          size,
          bust_max: Number(data.sizeChart[index]?.bust_max || 0),
          waist_max: Number(data.sizeChart[index]?.waist_max || 0),
          hips_max: Number(data.sizeChart[index]?.hips_max || 0),
          shoulder_max: Number(data.sizeChart[index]?.shoulder_max || 0),
          sleeve_length: Number(data.sizeChart[index]?.sleeve_length || 0),
          dress_length: Number(data.sizeChart[index]?.dress_length || 0),
        }));
      } else {
        data.sizeChart = [];
      }

      data.images = images
        .sort((a, b) => a.index - b.index)
        .map((img) => img.url);

      await dispatch(addProduct(data)).unwrap();

      reset();
      setImages([]);
      navigate("/products");
    } catch (err) {
      popMessage("Something went wrong");
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
          className="border border-gray-300 p-6 rounded-lg space-y-5"
        >
          <input {...register("name")} placeholder="Product Name" className="w-full border p-2 rounded" />

          <select {...register("category", { required: true })} className="w-full border p-2 rounded">
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <input {...register("subcategory")} placeholder="Subcategory" className="w-full border p-2 rounded" />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} minHeight={250} />
            )}
          />

          <UploadCard label="Product Images" onChange={handleAddImage} folder="products" />

          <div className="grid grid-cols-4 gap-4 mt-4">
            {images.map((img, index) => (
              <div key={index} className="border rounded-lg p-2 relative bg-gray-50">
                <img src={img.url} alt="" className="h-32 w-full object-cover rounded" />
                <div className="flex justify-between mt-2">
                  <span>#{index}</span>
                  <select value={index} onChange={(e) => handleIndexChange(index, Number(e.target.value))} className="border text-sm">
                    {images.map((_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">X</button>
              </div>
            ))}
          </div>

          <input type="number" {...register("price")} placeholder="Price" className="w-full border p-2 rounded" />
          <input type="number" {...register("discountPrice")} placeholder="Discount Price" className="w-full border p-2 rounded" />
          <input type="number" {...register("stock")} placeholder="Stock Quantity" className="w-full border p-2 rounded" />
          <input type="number" {...register("estimatedDeliveryDays")} placeholder="Estimated Delivery (Days)" className="w-full border p-2 rounded" />

          <input {...register("tags")} placeholder="Tags (comma separated)" className="w-full border p-2 rounded" />

          <input {...register("whatsIncluded")} placeholder="What's Included" className="w-full border p-2 rounded" />

          <textarea {...register("careInstructions")} placeholder="Care Instructions" className="w-full border p-2 rounded" />

          <select {...register("fabric")} className="w-full border p-2 rounded">
            <option value="">Select Fabric / Cloth Type</option>
            <option value="Cotton">Cotton</option>
            <option value="Lawn">Lawn</option>
            <option value="Silk">Silk</option>
            <option value="Georgette">Georgette</option>
            <option value="Chiffon">Chiffon</option>
            <option value="Linen">Linen</option>
            <option value="Velvet">Velvet</option>
            <option value="Rayon">Rayon</option>
            <option value="Net">Net</option>
            <option value="Organza">Organza</option>
            <option value="Pashmina">Pashmina</option>
            <option value="other">Other</option>
          </select>

          <select {...register("occasion")} className="w-full border p-2 rounded">
            <option value="">Select Occasion</option>
            <option value="Ramadan">Ramadan</option>
            <option value="Eid">Eid</option>
            <option value="Wedding">Wedding</option>
            <option value="Festive">Festive</option>
            <option value="Casual">Casual</option>
            <option value="Party Wear">Party Wear</option>
            <option value="Formal">Formal</option>
            <option value="Office Wear">Office Wear</option>
            <option value="luxurious">Luxurious</option>
            <option value="other">Other</option>
          </select>

          <input {...register("sizes")} placeholder="S, M, L" className="w-full border p-2 rounded" />

          {sizesValue && sizesValue.split(",").map((size, index) => (
            <div key={index} className="border p-3 rounded bg-white space-y-2">
              <h4 className="font-medium text-purple-700">Size: {size.trim()}</h4>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Bust Max" {...register(`sizeChart.${index}.bust_max`, { valueAsNumber: true })} className="border p-2 rounded" />
                <input type="number" placeholder="Waist Max" {...register(`sizeChart.${index}.waist_max`, { valueAsNumber: true })} className="border p-2 rounded" />
                <input type="number" placeholder="Hips Max" {...register(`sizeChart.${index}.hips_max`, { valueAsNumber: true })} className="border p-2 rounded" />
                <input type="number" placeholder="Shoulder Max" {...register(`sizeChart.${index}.shoulder_max`, { valueAsNumber: true })} className="border p-2 rounded" />
                <input type="number" placeholder="Sleeve Length" {...register(`sizeChart.${index}.sleeve_length`, { valueAsNumber: true })} className="border p-2 rounded" />
                <input type="number" placeholder="Dress Length" {...register(`sizeChart.${index}.dress_length`, { valueAsNumber: true })} className="border p-2 rounded" />
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("fitAdjustmentEnabled")} />
            <label>Enable Fit Adjustment</label>
          </div>

          {fitAdjustmentEnabled && (
            <input type="number" {...register("fitAdjustmentFee")} placeholder="Fit Adjustment Fee" className="w-full border p-2 rounded" />
          )}

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("codAvailable")} />
            <label>Cash On Delivery Available</label>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("isActive")} defaultChecked />
            <label>Active Product</label>
          </div>

          <button className="bg-linear-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded">
            Save Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProducts;