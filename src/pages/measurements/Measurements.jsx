import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Measurements = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
const navigate = useNavigate()
  // Backend-shaped dummy profiles
  const [profiles, setProfiles] = useState([
    {
      id: "profile_1",
      profileName: "Me",
      measurements: {
        bust: 92,
        waist: 74,
        hips: 98,
        shoulder: 40,
        sleeveLength: 22,
        dressLength: 46,
      },
      notes: "Preferred loose fit",
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [editingId, setEditingId] = useState(null);

  // -------- ADD / UPDATE --------

  const onSubmit = (data) => {
    const formattedProfile = {
      id: editingId ? editingId : Date.now().toString(),
      profileName: data.profileName,
      measurements: {
        bust: Number(data.bust),
        waist: Number(data.waist),
        hips: Number(data.hips),
        shoulder: Number(data.shoulder),
        sleeveLength: Number(data.sleeveLength),
        dressLength: Number(data.dressLength),
      },
      notes: data.notes,
      lastUpdated: new Date().toISOString(),
    };

    if (editingId) {
      console.log("UPDATE MEASUREMENT PROFILE:", formattedProfile);

      setProfiles(
        profiles.map((p) =>
          p.id === editingId ? formattedProfile : p
        )
      );

      setEditingId(null);
    } else {
      console.log("ADD MEASUREMENT PROFILE:", {
        userId: data.userId,
        profile: formattedProfile,
      });

      setProfiles([...profiles, formattedProfile]);
    }

    reset();
  };

  // -------- EDIT --------

  const startEdit = (profile) => {
    setEditingId(profile.id);

    setValue("profileName", profile.profileName);
    setValue("bust", profile.measurements.bust);
    setValue("waist", profile.measurements.waist);
    setValue("hips", profile.measurements.hips);
    setValue("shoulder", profile.measurements.shoulder);
    setValue("sleeveLength", profile.measurements.sleeveLength);
    setValue("dressLength", profile.measurements.dressLength);
    setValue("notes", profile.notes);
  };

  // -------- DELETE --------

  const deleteProfile = (id) => {
    console.log("DELETE PROFILE ID:", id);
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  return (
    <Layout>
      <div className="p-6">
         <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Measurement Profiles
          </h2>

          <button
            className="p-2 bg-linear-to-r from-pink-500 to-purple-500 rounded-md text-white"
            onClick={() => navigate("/add/measurement")}
          >
            Add New
          </button>
        </div>
       

        {/* LIST SECTION */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Saved Profiles
          </h3>

          {profiles.length === 0 ? (
            <p className="text-purple-600">No profiles available</p>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white p-4 rounded border flex justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      {profile.profileName}
                    </h4>

                    <p className="text-sm">
                      Bust: {profile.measurements.bust} | Waist:{" "}
                      {profile.measurements.waist} | Hips:{" "}
                      {profile.measurements.hips}
                    </p>

                    <p className="text-sm">
                      Shoulder: {profile.measurements.shoulder} |
                      Sleeve: {profile.measurements.sleeveLength} |
                      Length: {profile.measurements.dressLength}
                    </p>

                    <p className="text-sm text-purple-600">
                      Notes: {profile.notes}
                    </p>

                    <p className="text-xs text-gray-500">
                      Last Updated:{" "}
                      {new Date(
                        profile.lastUpdated
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(profile)}
                      className="bg-purple-100 p-2 rounded"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteProfile(profile.id)}
                      className="bg-red-100 p-2 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Measurements;
