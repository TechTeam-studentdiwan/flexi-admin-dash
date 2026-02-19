import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../../store/coupons/couponThunks";
import SideDrawer from "../../components/SideDrawer";

const Coupons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { coupons, loading } = useSelector((state) => state.coupon);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete coupon?")) {
      await dispatch(deleteCoupon(id));
    }
  };

  const toggleStatus = async (coupon) => {
    await dispatch(
      updateCoupon({
        id: coupon._id,
        data: { isActive: !coupon.isActive },
      }),
    );
  };

  const openDetails = (coupon) => {
    setSelectedCoupon(coupon);
    setIsOpen(true);
  };

  const closeDetails = () => {
    setSelectedCoupon(null);
    setIsOpen(false);
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Coupon Management
          </h2>

          <button
            className="px-5 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow hover:opacity-90 transition"
            onClick={() => navigate("/add/coupon")}
          >
          + Add Coupon
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading coupons...</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {coupons.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No coupons found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">Valid Till</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.map((coupon) => (
                    <tr
                      key={coupon._id}
                      onClick={() => openDetails(coupon)}
                      className="border-t hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="p-4 font-semibold">{coupon.code}</td>

                      <td className="p-4 capitalize">{coupon.type}</td>

                      <td className="p-4">
                        {coupon.type === "percentage"
                          ? `${coupon.value}%`
                          : `QAR ${coupon.value}`}
                      </td>

                      <td className="p-4">
                        {new Date(coupon.validTo).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            coupon.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td
                        className="p-4 text-right space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            navigate(`/edit/coupon/${coupon._id}`, {
                              state: { coupon },
                            })
                          }
                          className="p-2"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => toggleStatus(coupon)}
                          className="p-2"
                        >
                          {coupon.isActive ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Sidebar */}
        {isOpen && selectedCoupon && (
          <SideDrawer
            isOpen={isOpen}
            onClose={closeDetails}
            title="Coupon Details"
          >
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-x-2">
                <strong>Description:</strong>
                <div
                  className="mt-1 text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: selectedCoupon.description || "",
                  }}
                />
              </div>
              <div>
                <strong>Code:</strong> {selectedCoupon.code}
              </div>

              <div>
                <strong>Type:</strong> {selectedCoupon.type}
              </div>

              <div>
                <strong>Value:</strong>{" "}
                {selectedCoupon.type === "percentage"
                  ? `${selectedCoupon.value}%`
                  : `QAR ${selectedCoupon.value}`}
              </div>

              <div>
                <strong>Minimum Cart Value:</strong> QAR{" "}
                {selectedCoupon.minCartValue}
              </div>

              <div>
                <strong>Maximum Discount:</strong>{" "}
                {selectedCoupon.maxDiscount
                  ? `QAR ${selectedCoupon.maxDiscount}`
                  : "No limit"}
              </div>

              <div>
                <strong>Usage Limit:</strong> {selectedCoupon.usageLimit}
              </div>

              <div>
                <strong>Used Count:</strong> {selectedCoupon.usedCount}
              </div>

              <div>
                <strong>Valid From:</strong>{" "}
                {new Date(selectedCoupon.validFrom).toLocaleDateString()}
              </div>

              <div>
                <strong>Valid To:</strong>{" "}
                {new Date(selectedCoupon.validTo).toLocaleDateString()}
              </div>

              <div>
                <strong>Eligible Categories:</strong>{" "}
                {selectedCoupon.eligibleCategories?.length > 0
                  ? selectedCoupon.eligibleCategories.join(", ")
                  : "All Categories"}
              </div>

              <div>
                <strong>First Order Only:</strong>{" "}
                {selectedCoupon.firstOrderOnly ? "Yes" : "No"}
              </div>

              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selectedCoupon.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedCoupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </SideDrawer>
        )}
      </div>
    </Layout>
  );
};

export default Coupons;
