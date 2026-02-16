import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Layout from "../../components/Layout";
import { updateProduct } from "../../store/products/productThunks";
import RichTextEditor from "../../components/AdminEditor";
// import RichTextEditor from "../../components/common/RichTextEditor";

const EditProduct = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = state?.product;

  const { register, handleSubmit, control, reset } = useForm();

  // If refresh happens → no state → redirect
  useEffect(() => {
    if (!product) {
      navigate("/products");
    } else {
      reset({
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        fabric: product.fabric,
        occasion: product.occasion,
        sizes: product.sizes?.join(", "),
        stock: product.stock,
        description: product.description,
      });
    }
  }, [product, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      data.price = Number(data.price);
      data.discountPrice = Number(data.discountPrice);
      data.stock = Number(data.stock);
      data.sizes = data.sizes.split(",").map((s) => s.trim());

      await dispatch(
        updateProduct({
          id: product._id,
          data,
        })
      ).unwrap();

      navigate("/products");
    } catch (err) {
      alert(err);
    }
  };

  if (!product) return null;

  return (
    <Layout>
      <div className=" mx-auto bg-white  rounded ">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("name")}
            className="w-full border p-2 rounded"
            placeholder="Product Name"
          />

          <input
            type="number"
            {...register("price")}
            className="w-full border p-2 rounded"
            placeholder="Price"
          />

          <input
            type="number"
            {...register("discountPrice")}
            className="w-full border p-2 rounded"
            placeholder="Discount Price"
          />

          <input
            {...register("fabric")}
            className="w-full border p-2 rounded"
            placeholder="Fabric"
          />

          <input
            {...register("occasion")}
            className="w-full border p-2 rounded"
            placeholder="Occasion"
          />

          <input
            {...register("sizes")}
            className="w-full border p-2 rounded"
            placeholder="S, M, L"
          />

          <input
            type="number"
            {...register("stock")}
            className="w-full border p-2 rounded"
            placeholder="Stock"
          />

          {/* Rich Text Editor */}
          <div>
            <label className="block mb-2 font-medium text-gray-600">
              Description
            </label>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  minHeight={200}
                />
              )}
            />
          </div>

          <button className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded ">
            Update Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
