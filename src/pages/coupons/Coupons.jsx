import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Coupons = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
const navigate = useNavigate()
  // Backend-shaped dummy coupons
  const [coupons, setCoupons] = useState([
    {
      id: "coupon_1",
      code: "RAMADAN15",
      type: "percentage",
      value: 15,
      minCartValue: 200,
      maxDiscount: 50,
      validFrom: "2024-03-01",
      validTo: "2024-04-01",
      usageLimit: 100,
      usedCount: 10,
      eligibleCategories: ["Chikankari"],
      firstOrderOnly: false,
      isActive: true,
    },
  ]);

  const [editingId, setEditingId] = useState(null);

  // -------- ADD / UPDATE --------

  const onSubmit = (data) => {
    const formattedCoupon = {
      id: editingId ? editingId : Date.now().toString(),
      code: data.code,
      type: data.type,
      value: Number(data.value),
      minCartValue: Number(data.minCartValue),
      maxDiscount: Number(data.maxDiscount),
      validFrom: data.validFrom,
      validTo: data.validTo,
      usageLimit: Number(data.usageLimit),
      usedCount: editingId
        ? coupons.find((c) => c.id === editingId).usedCount
        : 0,
      eligibleCategories: data.eligibleCategories
        ? data.eligibleCategories.split(",")
        : [],
      firstOrderOnly: data.firstOrderOnly || false,
      isActive: data.isActive || false,
    };

    if (editingId) {
      console.log("UPDATE COUPON:", formattedCoupon);

      setCoupons(
        coupons.map((c) =>
          c.id === editingId ? formattedCoupon : c
        )
      );

      setEditingId(null);
    } else {
      console.log("ADD COUPON:", formattedCoupon);
      setCoupons([...coupons, formattedCoupon]);
    }

    reset();
  };

  // -------- EDIT --------

  const startEdit = (coupon) => {
    setEditingId(coupon.id);

    Object.keys(coupon).forEach((key) => {
      if (key === "eligibleCategories") {
        setValue(key, coupon[key].join(","));
      } else {
        setValue(key, coupon[key]);
      }
    });
  };

  // -------- DELETE --------

  const deleteCoupon = (id) => {
    console.log("DELETE COUPON ID:", id);
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  const toggleStatus = (id) => {
    console.log("TOGGLE COUPON STATUS:", id);

    setCoupons(
      coupons.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Coupon Management
          </h2>

          <button
            className="p-2 bg-linear-to-r from-pink-500 to-purple-500 rounded-md text-white"
            onClick={() => navigate("/add/coupon")}
          >
            Add New
          </button>
        </div>
        {/* LIST SECTION */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Existing Coupons
          </h3>

          {coupons.length === 0 ? (
            <p>No coupons available</p>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white p-4 rounded border flex justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      {coupon.code}{" "}
                      {!coupon.isActive && (
                        <span className="text-red-500 text-sm">
                          (Inactive)
                        </span>
                      )}
                    </h4>

                    <p className="text-sm">
                      Type: {coupon.type} | Value: {coupon.value}
                    </p>

                    <p className="text-sm">
                      Min Cart: {coupon.minCartValue} | Max Discount: {coupon.maxDiscount}
                    </p>

                    <p className="text-sm">
                      Valid: {coupon.validFrom} → {coupon.validTo}
                    </p>

                    <p className="text-sm">
                      Used: {coupon.usedCount}/{coupon.usageLimit}
                    </p>

                    <p className="text-sm">
                      Categories: {coupon.eligibleCategories.join(", ")}
                    </p>

                    {coupon.firstOrderOnly && (
                      <p className="text-xs text-purple-600">
                        First Order Only
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      className="bg-yellow-100 p-2 rounded"
                    >
                      {coupon.isActive ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => startEdit(coupon)}
                      className="bg-purple-100 p-2 rounded"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteCoupon(coupon.id)}
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

export default Coupons;
