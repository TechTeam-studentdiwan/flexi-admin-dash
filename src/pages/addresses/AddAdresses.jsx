import React from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";

const AddAddresses = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("ADD ADDRESS:", data);
    reset();
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add Address</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-3">

          <input {...register("userId")} placeholder="User ID" className="input" />
          <input {...register("label")} placeholder="Label (Home/Work)" className="input" />
          <input {...register("fullName")} placeholder="Full Name" className="input" />
          <input {...register("phone")} placeholder="Phone" className="input" />

          <input {...register("addressLine1")} placeholder="Address Line 1" className="input" />
          <input {...register("city")} placeholder="City" className="input" />
          <input {...register("state")} placeholder="State" className="input" />
          <input {...register("postalCode")} placeholder="Postal Code" className="input" />

          <label>
            <input type="checkbox" {...register("isDefault")} /> Default Address
          </label>

          <button className="btn">Save Address</button>
        </form>
      </div>
    </Layout>
  );
};

export default AddAddresses;
