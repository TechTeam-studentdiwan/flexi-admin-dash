import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Layout from "../../components/Layout";
import { updateProduct } from "../../store/products/productThunks";
import RichTextEditor from "../../components/AdminEditor";
import UploadCard from "../../components/UploadCard";
import { usePopup } from "../../components/PopupMessage/PopupContext";

const EditProduct = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { popMessage } = usePopup();

  const product = state?.product;

  const { register, handleSubmit, control, reset, watch, setValue } =
    useForm();

  const fitAdjustmentEnabled = watch("fitAdjustmentEnabled");
  const sizesValue = watch("sizes");
  const fabricVal = watch("fabric");
  const occasionVal = watch("occasion");

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!product) {
      navigate("/products");
    } else {
      reset({
        name: product.name || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        fabric: product.fabric || "",
        occasion: product.occasion || "",
        subcategory: product.subcategory || "",
        stock: product.stock || "",
        estimatedDeliveryDays: product.estimatedDeliveryDays || "",
        sizes: product.sizes?.join(", ") || "",
        tags: product.tags?.join(", ") || "",
        whatsIncluded: product.whatsIncluded || "",
        careInstructions: product.careInstructions || "",
        description: product.description || "",
        fitAdjustmentEnabled: product.fitAdjustmentEnabled || false,
        fitAdjustmentFee: product.fitAdjustmentFee || "",
        codAvailable: product.codAvailable || false,
        isActive: product.isActive ?? true,
      });

      if (product.images?.length) {
        setImages(
          product.images.map((url, index) => ({
            url,
            index,
          }))
        );
      }

      if (product.sizeChart?.length) {
        product.sizeChart.forEach((item, index) => {
          setValue(`sizeChart.${index}.bust_max`, item.bust_max);
          setValue(`sizeChart.${index}.waist_max`, item.waist_max);
          setValue(`sizeChart.${index}.hips_max`, item.hips_max);
          setValue(`sizeChart.${index}.shoulder_max`, item.shoulder_max);
          setValue(`sizeChart.${index}.sleeve_length`, item.sleeve_length);
          setValue(`sizeChart.${index}.dress_length`, item.dress_length);
        });
      }
    }
  }, [product, navigate, reset, setValue]);

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
      data.isActive = Boolean(data.isActive);

      if (data.fabric === "other" && data.customFabric?.trim()) data.fabric = data.customFabric.trim();
      delete data.customFabric;
      if (data.occasion === "other" && data.customOccasion?.trim()) data.occasion = data.customOccasion.trim();
      delete data.customOccasion;

      if (data.tags) {
        data.tags = data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      const sizesArray = data.sizes
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      data.sizes = sizesArray;

      if (data.sizeChart) {
        data.sizeChart = sizesArray.map((size, index) => ({
          size,
          bust_max: Number(data.sizeChart[index]?.bust_max || 0),
          waist_max: Number(data.sizeChart[index]?.waist_max || 0),
          hips_max: Number(data.sizeChart[index]?.hips_max || 0),
          shoulder_max: Number(data.sizeChart[index]?.shoulder_max || 0),
          sleeve_length: Number(
            data.sizeChart[index]?.sleeve_length || 0
          ),
          dress_length: Number(
            data.sizeChart[index]?.dress_length || 0
          ),
        }));
      } else {
        data.sizeChart = [];
      }

      data.images = images
        .sort((a, b) => a.index - b.index)
        .map((img) => img.url);

      await dispatch(
        updateProduct({
          id: product._id,
          data,
        })
      ).unwrap();

      navigate("/products");
    } catch (err) {
      popMessage("Something went wrong");
    }
  };

  if (!product) return null;

  return (
    <Layout>
      <div className="mx-auto bg-white rounded space-y-5">
        <h2 className="text-2xl font-bold text-purple-700">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input {...register("name")} className="w-full border p-2 rounded" />

          <input
            type="number"
            {...register("price")}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            {...register("discountPrice")}
            className="w-full border p-2 rounded"
          />

          <input
            {...register("subcategory")}
            placeholder="Subcategory"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            {...register("stock")}
            placeholder="Stock"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            {...register("estimatedDeliveryDays")}
            placeholder="Estimated Delivery Days"
            className="w-full border p-2 rounded"
          />

          <input
            {...register("tags")}
            placeholder="Tags (comma separated)"
            className="w-full border p-2 rounded"
          />

          <input
            {...register("whatsIncluded")}
            placeholder="What's Included"
            className="w-full border p-2 rounded"
          />

          <textarea
            {...register("careInstructions")}
            placeholder="Care Instructions"
            className="w-full border p-2 rounded"
          />

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
          {fabricVal === "other" && (
            <input {...register("customFabric")} placeholder="Type custom fabric type..." className="w-full border p-2 rounded mt-1" />
          )}

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
          {occasionVal === "other" && (
            <input {...register("customOccasion")} placeholder="Type custom occasion..." className="w-full border p-2 rounded mt-1" />
          )}

          <input {...register("sizes")} className="w-full border p-2 rounded" />

          {/* Size Chart */}
          {sizesValue &&
            sizesValue
              .split(",")
              .map((size) => size.trim())
              .filter(Boolean)
              .map((size, index) => (
                <div key={index} className="border p-3 rounded space-y-2">
                  <h4>Size: {size}</h4>
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

          <UploadCard
            label="Add More Images"
            onChange={handleAddImage}
            folder="products"
          />

          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="border p-2 rounded relative">
                <img src={img.url} className="h-32 w-full object-cover rounded" />
                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">X</button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("fitAdjustmentEnabled")} />
            <label>Enable Fit Adjustment</label>
          </div>

          {fitAdjustmentEnabled && (
            <input type="number" {...register("fitAdjustmentFee")} className="w-full border p-2 rounded" placeholder="Fit Adjustment Fee" />
          )}

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("codAvailable")} />
            <label>COD Available</label>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("isActive")} />
            <label>Active Product</label>
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
                minHeight={200}
              />
            )}
          />

          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded">
            Update Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;