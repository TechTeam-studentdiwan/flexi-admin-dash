import React, { useState } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfileThunk } from "../store/auth/authThunks";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, updating } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    deliveryfee: user?.deliveryfee || 0,
    currentPassword: "",
    newPassword: "",
  });

  if (!user) return null;

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      deliveryfee: formData.deliveryfee,
    };

    if (formData.newPassword) {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    await dispatch(
      updateUserProfileThunk({
        userId: user._id,
        data: payload,
      }),
    );

    setIsEditing(false);
  };

  return (
    <Layout>
      <div className=" mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-pink-500 to-purple-600 p-8 text-white">
            <h2 className="text-3xl font-bold">My Profile</h2>
            <p className="text-purple-100 text-sm mt-1">
              Manage your account information
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Account Details
              </h3>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={updating}
                    className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>

              {user.isAdmin && (
                <div>
                  <label className="text-sm text-gray-500">Delivery Fee</label>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={formData.deliveryfee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryfee: Number(e.target.value),
                      })
                    }
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500">Role</label>
                <input
                  type="text"
                  disabled
                  value={user.isAdmin ? "Administrator" : "Customer"}
                  className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
                />
              </div>
            </div>

            {isEditing && (
              <div className="border-t pt-6 mt-6 space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Change Password
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
