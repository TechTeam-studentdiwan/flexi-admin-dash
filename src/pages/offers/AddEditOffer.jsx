import { useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { createOffer, updateOffer } from "../../store/offers/offerThunks";

const AddEditOffer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const existing = location.state?.offer;

  const [formData, setFormData] = useState({
    title: existing?.title || "",
    subtitle: existing?.subtitle || "",
    link: existing?.link || "",
    position: existing?.position || 0,
  });

  const handleSubmit = async () => {
    if (existing) {
      await dispatch(updateOffer({ id: existing._id, data: formData }));
    } else {
      await dispatch(createOffer(formData));
    }
    navigate("/offers");
  };

  return (
    <Layout>
      <div className=" mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          {existing ? "Edit Offer" : "Create Offer"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Subtitle"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Link"
            value={formData.link}
            onChange={(e) =>
              setFormData({ ...formData, link: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={handleSubmit}
            className="px-3 bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg"
          >
            {existing ? "Update Offer" : "Create Offer"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AddEditOffer;
