import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { createOffer, updateOffer } from "../../store/offers/offerThunks";
import { usePopup } from "../../components/PopupMessage/PopupContext";
import UploadCard from "../../components/UploadCard";
import { useForm, Controller } from "react-hook-form";

const AddEditOffer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { popMessage } = usePopup();
  const existing = location.state?.offer;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: existing?.image || "",
      link: existing?.link || "",
      position: existing?.position || 0,
    },
  });

  useEffect(() => {
    if (existing) {
      setValue("image", existing.image);
      setValue("link", existing.link);
      setValue("position", existing.position);
    }
  }, [existing, setValue]);

  const onSubmit = async (data) => {
    try {
      if (existing) {
        await dispatch(
          updateOffer({ id: existing._id, data })
        ).unwrap();
      } else {
        await dispatch(createOffer(data)).unwrap();
      }

      navigate("/offers");
    } catch (error) {
      popMessage("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          {existing ? "Edit Offer" : "Create Offer"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="image"
            control={control}
            rules={{ required: "Offer image is required" }}
            render={({ field }) => (
              <UploadCard
                label="Offer Image"
                value={field.value}
                onChange={field.onChange}
                folder="offers"
                height="h-52"
              />
            )}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}

          {/* Link */}
          <div>
            <input
              type="text"
              placeholder="Redirect Link (optional)"
              {...register("link", {
                pattern: {
                  value:
                    /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\w\-\._~:/?#[\]@!$&'()*+,;=.]+)?$/,
                  message: "Enter a valid URL",
                },
              })}
              className="w-full border p-3 rounded-lg"
            />
            {errors.link && (
              <p className="text-red-500 text-sm mt-1">
                {errors.link.message}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <input
              type="number"
              placeholder="Position"
              {...register("position", {
                required: "Position is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Position must be 0 or greater",
                },
              })}
              className="w-full border p-3 rounded-lg"
            />
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">
                {errors.position.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            {existing ? "Update Offer" : "Create Offer"}
          </button>
           <p className="text-sm text-gray-500 text-center mt-4">
            For best slider UI, use a panoramic image (recommended 2:4 or
            wide landscape ratio like 1200x600).
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditOffer;