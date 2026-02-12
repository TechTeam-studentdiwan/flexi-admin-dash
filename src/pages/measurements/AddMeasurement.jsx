import React from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";

const AddMeasurements = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("MEASUREMENT PROFILE:", data);
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add Measurement Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-3">

          <input {...register("userId")} placeholder="User ID" className="input" />
          <input {...register("profileName")} placeholder="Profile Name" className="input" />

          <input type="number" {...register("bust")} placeholder="Bust" className="input" />
          <input type="number" {...register("waist")} placeholder="Waist" className="input" />
          <input type="number" {...register("hips")} placeholder="Hips" className="input" />
          <input type="number" {...register("shoulder")} placeholder="Shoulder" className="input" />

          <textarea {...register("notes")} placeholder="Notes" className="input" />

          <button className="btn">Save Profile</button>
        </form>
      </div>
    </Layout>
  );
};

export default AddMeasurements;
