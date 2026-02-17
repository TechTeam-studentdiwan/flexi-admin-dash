import React from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-purple-800">
            My Profile
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your personal information
          </p>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Account Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium">
                {user.isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Saved Addresses
          </h3>

          {user.addresses?.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No addresses added yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {user.addresses.map((address) => (
                <div
                  key={address._id}
                  className="border rounded-lg p-4 relative bg-gray-50"
                >
                  {/* Label */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-purple-700 uppercase">
                      {address.label}
                    </span>

                    {address.isDefault && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {address.addressLine1}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.addressLine2}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.country} - {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {address.phone}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
