import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Layout from "../../components/Layout";
import { updateCoupon } from "../../store/coupons/couponThunks";
import RichTextEditor from "../../components/AdminEditor";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const EditCoupon = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const coupon = state?.coupon;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      code: "",
      type: "percentage",
      description: "",
      value: 0,
      minCartValue: 0,
      maxDiscount: 0,
      validFrom: "",
      validTo: "",
      usageLimit: 0,
      eligibleCategories: "",
      firstOrderOnly: false,
    },
  });

  useEffect(() => {
    if (!coupon) {
      navigate("/coupons");
    } else {
      reset({
        code: coupon.code || "",
        type: coupon.type || "percentage",
        description: coupon.description || "",
        value: coupon.value ?? 0,
        minCartValue: coupon.minCartValue ?? 0,
        maxDiscount: coupon.maxDiscount ?? 0,
        validFrom: formatDate(coupon.validFrom),
        validTo: formatDate(coupon.validTo),
        usageLimit: coupon.usageLimit ?? 0,
        eligibleCategories: coupon.eligibleCategories?.join(", ") || "",
        firstOrderOnly: coupon.firstOrderOnly || false,
      });
    }
  }, [coupon, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      data.value = Number(data.value);
      data.minCartValue = Number(data.minCartValue);
      data.maxDiscount = Number(data.maxDiscount);
      data.usageLimit = Number(data.usageLimit);

      if (data.eligibleCategories) {
        data.eligibleCategories = data.eligibleCategories
          .split(",")
          .map((c) => c.trim());
      } else {
        data.eligibleCategories = [];
      }

      await dispatch(
        updateCoupon({
          id: coupon._id,
          data,
        })
      ).unwrap();

      navigate("/coupons");
    } catch (err) {
      alert(err);
    }
  };

  if (!coupon) return null;

  return (
    <Layout>
      <div className="mx-auto bg-white rounded">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Edit Coupon
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 border border-gray-300 p-6 rounded-lg"
        >
          <input
            {...register("code", { required: true })}
            placeholder="Coupon Code"
            className="w-full border p-2 rounded"
          />

          <select
            {...register("type")}
            className="w-full border p-2 rounded"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
            <option value="freedelivery">Free Delivery</option>
          </select>

          {/* Rich Text Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Description
            </label>

            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  minHeight={150}
                />
              )}
            />
          </div>

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 bg-linear-to-r from-pink-500 to-purple-600 text-white py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Coupon"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditCoupon;
