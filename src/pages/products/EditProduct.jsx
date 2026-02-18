import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Layout from "../../components/Layout";
import { updateProduct } from "../../store/products/productThunks";
import RichTextEditor from "../../components/AdminEditor";
import UploadCard from "../../components/UploadCard";
const occasions = [
  "Ramadan",
  "Eid",
  "Wedding",
  "Festive",
  "Casual",
  "Party Wear",
  "Formal",
  "Office Wear",
  "Luxurious",
  "Other",
];

const fabrics = [
  "Cotton",
  "Lawn",
  "Silk",
  "Georgette",
  "Chiffon",
  "Linen",
  "Velvet",
  "Rayon",
  "Net",
  "Organza",
  "Pashmina",
  "Other",
];

const EditProduct = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = state?.product;

  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      fitAdjustmentEnabled: false,
    },
  });

  const fitAdjustmentEnabled = watch("fitAdjustmentEnabled");
  const sizesValue = watch("sizes");

  const [images, setImages] = useState([]);

  // Load default data
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
        sizes: product.sizes?.join(", ") || "",
        stock: product.stock || "",
        description: product.description || "",
        fitAdjustmentEnabled: product.fitAdjustmentEnabled || false,
        fitAdjustmentFee: product.fitAdjustmentFee || "",
      });

      // Load images with index
      if (product.images?.length) {
        setImages(
          product.images.map((url, index) => ({
            url,
            index,
          })),
        );
      }

      // Load sizeChart
      if (product.sizeChart?.length) {
        product.sizeChart.forEach((item, index) => {
          setValue(`sizeChart.${index}.bust_max`, item.bust_max);
          setValue(`sizeChart.${index}.waist_max`, item.waist_max);
          setValue(`sizeChart.${index}.hips_max`, item.hips_max);
          setValue(`sizeChart.${index}.shoulder_max`, item.shoulder_max);
        });
      }
    }
  }, [product, navigate, reset, setValue]);

  // Image Handlers
  const handleAddImage = (url) => {
    if (!url) return;
    setImages((prev) => [...prev, { url, index: prev.length }]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) =>
      prev
        .filter((_, i) => i !== indexToRemove)
        .map((img, i) => ({ ...img, index: i })),
    );
  };

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
      data.stock = Number(data.stock);

      data.fitAdjustmentEnabled = Boolean(data.fitAdjustmentEnabled);
      data.fitAdjustmentFee = data.fitAdjustmentEnabled
        ? Number(data.fitAdjustmentFee)
        : 0;

      const sizesArray = data.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      data.sizes = sizesArray;

      // Build sizeChart properly
      if (data.sizeChart) {
        data.sizeChart = sizesArray.map((size, index) => ({
          size,
          bust_max: Number(data.sizeChart[index]?.bust_max || 0),
          waist_max: Number(data.sizeChart[index]?.waist_max || 0),
          hips_max: Number(data.sizeChart[index]?.hips_max || 0),
          shoulder_max: Number(data.sizeChart[index]?.shoulder_max || 0),
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
        }),
      ).unwrap();

      navigate("/products");
    } catch (err) {
      alert(err);
    }
  };

  if (!product) return null;

  return (
    <Layout>
      <div className="mx-auto bg-white rounded">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
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

          <select {...register("fabric")} className="w-full border p-2 rounded">
            <option value="">Select Fabric</option>
            {fabrics.map((fabric) => (
              <option key={fabric} value={fabric}>
                {fabric}
              </option>
            ))}
          </select>

          <select
            {...register("occasion")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Occasion</option>
            {occasions.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>

          <input {...register("sizes")} className="w-full border p-2 rounded" />

          <input
            type="number"
            {...register("stock")}
            className="w-full border p-2 rounded"
          />

          {/* Dynamic Size Chart */}
          {sizesValue && (
            <div className="border p-4 rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-semibold text-gray-700">Size Chart</h3>

              {sizesValue
                .split(",")
                .map((size) => size.trim())
                .filter(Boolean)
                .map((size, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded bg-white space-y-2"
                  >
                    <h4 className="font-medium text-purple-700">
                      Size: {size}
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Bust Max"
                        {...register(`sizeChart.${index}.bust_max`, {
                          valueAsNumber: true,
                        })}
                        className="border p-2 rounded"
                      />

                      <input
                        type="number"
                        placeholder="Waist Max"
                        {...register(`sizeChart.${index}.waist_max`, {
                          valueAsNumber: true,
                        })}
                        className="border p-2 rounded"
                      />

                      <input
                        type="number"
                        placeholder="Hips Max"
                        {...register(`sizeChart.${index}.hips_max`, {
                          valueAsNumber: true,
                        })}
                        className="border p-2 rounded"
                      />

                      <input
                        type="number"
                        placeholder="Shoulder Max"
                        {...register(`sizeChart.${index}.shoulder_max`, {
                          valueAsNumber: true,
                        })}
                        className="border p-2 rounded"
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Images */}
          <UploadCard
            label="Add More Images"
            onChange={handleAddImage}
            folder="products"
          />

          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 relative bg-gray-50"
              >
                <img
                  src={img.url}
                  className="h-32 w-full object-cover rounded"
                />

                <div className="flex justify-between mt-2">
                  <span>#{index}</span>
                  <select
                    value={index}
                    onChange={(e) =>
                      handleIndexChange(index, Number(e.target.value))
                    }
                  >
                    {images.map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

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

          {/* Fit Adjustment */}
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("fitAdjustmentEnabled")} />
            <label>Enable Fit Adjustment</label>
          </div>

          {fitAdjustmentEnabled && (
            <input
              type="number"
              {...register("fitAdjustmentFee")}
              className="w-full border p-2 rounded"
              placeholder="Fit Adjustment Fee"
            />
          )}

          {/* Description */}
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

          <button className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded">
            Update Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
