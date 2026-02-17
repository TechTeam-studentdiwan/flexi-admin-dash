import React from "react";
import Layout from "../../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CustomerDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);
console.log(products);

  const user = state?.user;

  if (!user) {
    return (
      <Layout>
        <div className="p-6">
          <p>User data not available.</p>
          <button
            onClick={() => navigate("/customers")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className=" space-y-6">

        {/* Header */}
        <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow">
          <div className="h-20 w-20 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-800">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-purple-800">
              {user.name}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-500">{user.phone}</p>

            {user.isAdmin && (
              <span className="inline-block mt-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">
            Addresses
          </h3>

          {user.addresses?.length === 0 && (
            <p className="text-gray-500">No addresses found.</p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {user.addresses?.map((address) => (
              <div
                key={address._id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <p className="font-semibold">{address.label}</p>
                <p>{address.fullName}</p>
                <p>{address.phone}</p>
                <p>{address.addressLine1}</p>
                <p>{address.addressLine2}</p>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>{address.country}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Measurement Profiles */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">
            Measurement Profiles
          </h3>

          {user.measurementProfiles?.length === 0 && (
            <p className="text-gray-500">No measurement profiles.</p>
          )}

          <div className="space-y-4">
            {user.measurementProfiles?.map((profile) => (
              <div
                key={profile._id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h4 className="font-semibold text-purple-700">
                  {profile.profileName}
                </h4>

                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <p>Bust: {profile.measurements.bust}</p>
                  <p>Waist: {profile.measurements.waist}</p>
                  <p>Hips: {profile.measurements.hips}</p>
                  <p>Shoulder: {profile.measurements.shoulder}</p>
                  <p>Sleeve: {profile.measurements.sleeve_length}</p>
                  <p>Length: {profile.measurements.dress_length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wishlist */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">
            Wishlist
          </h3>
          <p>Total Wishlist Items: {user.wishlist?.length || 0}</p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/customers")}
          className="px-4 py-2 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded"
        >
          Back to Customers
        </button>

      </div>
    </Layout>
  );
};

export default CustomerDetails;
