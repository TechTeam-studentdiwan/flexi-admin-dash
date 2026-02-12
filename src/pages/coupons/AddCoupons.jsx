import React from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";

const AddCoupons = () => {
  const { register, handleSubmit } = useForm();

  const onValidate = (data) => {
    console.log("VALIDATE COUPON:", data);
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Validate Coupon</h2>

        <form onSubmit={handleSubmit(onValidate)} className="card">
          <input
            {...register("code")}
            placeholder="Coupon Code"
            className="input"
          />
          <input
            type="number"
            {...register("cartTotal")}
            placeholder="Cart Total"
            className="input"
          />
          <input
            {...register("userId")}
            placeholder="User ID"
            className="input"
          />

          <button className="btn">Validate</button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCoupons;
