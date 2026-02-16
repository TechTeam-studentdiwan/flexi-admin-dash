import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "../../store/coupons/couponThunks";

const AddCoupons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      data.value = Number(data.value);
      data.minCartValue = Number(data.minCartValue);
      data.maxDiscount = Number(data.maxDiscount);
      data.usageLimit = Number(data.usageLimit);

      // Convert categories string to array
      if (data.eligibleCategories) {
        data.eligibleCategories = data.eligibleCategories
          .split(",")
          .map((c) => c.trim());
      }

      await dispatch(createCoupon(data)).unwrap();
      navigate("/coupons");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Layout>
      <div className="mx-auto bg-white rounded">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Create Coupon
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 border border-gray-300 p-6 rounded-lg"
        >
          {/* Code */}
          <input
            {...register("code", { required: true })}
            placeholder="Coupon Code"
            className="w-full border p-2 rounded"
          />

          {/* Type */}
          <select
            {...register("type")}
            className="w-full border p-2 rounded"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
            <option value="freedelivery">Free Delivery</option>
          </select>

          {/* Description ✅ */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Short description of this coupon..."
              rows={3}
              className="w-full border p-2 rounded resize-none"
            />
          </div>

          {/* Value */}
          <input
            type="number"
            {...register("value")}
            placeholder="Value"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            {...register("minCartValue")}
            placeholder="Min Cart Value"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            {...register("maxDiscount")}
            placeholder="Max Discount"
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            {...register("validFrom")}
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            {...register("validTo")}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            {...register("usageLimit")}
            placeholder="Usage Limit"
            className="w-full border p-2 rounded"
          />

          <input
            {...register("eligibleCategories")}
            placeholder="Eligible Categories (comma separated)"
            className="w-full border p-2 rounded"
          />

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("firstOrderOnly")} />
            First Order Only
          </label>

          <button className="px-4 bg-linear-to-r from-pink-500 to-purple-600 text-white py-2 rounded">
            Save Coupon
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCoupons;
