import React from "react";
import Layout from "../components/Layout";

const Profile = () => {
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          My Profile
        </h2>

        <div className="bg-white p-5 rounded shadow">
          <p className="mb-2">Name: Admin User</p>
          <p className="mb-2">Email: admin@mail.com</p>
          <p className="mb-2">Role: Administrator</p>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
