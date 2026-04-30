import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { assignVoucher, getAssignedVouchers, deleteCoupon } from "../../store/coupons/couponThunks";
import { getUsers } from "../../store/user/userThunks";
import { usePopup } from "../../components/PopupMessage/PopupContext";

const TYPE_LABELS = { percentage: "% Off", flat: "Flat QAR Off", freedelivery: "Free Delivery" };

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const discountLabel = (v) => {
  if (v.type === "percentage") return `${v.value}% OFF${v.maxDiscount ? ` (max QAR ${v.maxDiscount})` : ""}`;
  if (v.type === "flat") return `QAR ${v.value} OFF`;
  return "Free Delivery";
};

const AssignVoucher = () => {
  const dispatch = useDispatch();
  const { popMessage } = usePopup();

  const { users } = useSelector((s) => s.users);
  const { user: adminUser } = useSelector((s) => s.auth);

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    code: generateCode(),
    type: "percentage",
    value: "",
    maxDiscount: "",
    minCartValue: "",
    validFrom: new Date().toISOString().slice(0, 10),
    validTo: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  // List state
  const [vouchers, setVouchers] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listSearch, setListSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (adminUser?._id) {
      dispatch(getUsers({ page: 1, limit: 200 }));
      loadVouchers();
    }
  }, [dispatch, adminUser]);

  const loadVouchers = async () => {
    setListLoading(true);
    try {
      const res = await dispatch(getAssignedVouchers()).unwrap();
      setVouchers(res || []);
    } catch {
      // silent
    } finally {
      setListLoading(false);
    }
  };

  const normalUsers = users?.filter((u) => !u.isGuest) || [];
  const filteredUsers = normalUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return popMessage("Please select a user");
    if (!form.value && form.type !== "freedelivery") return popMessage("Please enter discount value");
    if (!form.validTo) return popMessage("Please enter expiry date");
    try {
      setSaving(true);
      await dispatch(
        assignVoucher({
          userId: selectedUser._id,
          ...form,
          value: form.type === "freedelivery" ? 0 : Number(form.value),
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          minCartValue: form.minCartValue ? Number(form.minCartValue) : 0,
        })
      ).unwrap();
      popMessage(`Voucher assigned to ${selectedUser.name || selectedUser.email}!`);
      setSelectedUser(null);
      setForm({ code: generateCode(), type: "percentage", value: "", maxDiscount: "", minCartValue: "", validFrom: new Date().toISOString().slice(0, 10), validTo: "", description: "" });
      loadVouchers();
    } catch (err) {
      popMessage(err || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this voucher? The user will no longer be able to use it.")) return;
    setDeletingId(id);
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      setVouchers((prev) => prev.filter((v) => v._id !== id));
      popMessage("Voucher deleted");
    } catch {
      popMessage("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVouchers = vouchers.filter((v) => {
    const q = listSearch.toLowerCase();
    if (!q) return true;
    return (
      v.code.toLowerCase().includes(q) ||
      v.assignedUserId?.name?.toLowerCase().includes(q) ||
      v.assignedUserId?.email?.toLowerCase().includes(q)
    );
  });

  const statusBadge = (v) => {
    if (v.isUsed) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">USED</span>;
    if (v.isExpired) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">EXPIRED</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">ACTIVE</span>;
  };

  return (
    <Layout>
      <div className="flex gap-8 items-start">

        {/* ── LEFT: Assign form ─────────────────────────────── */}
        <div className="w-96 flex-shrink-0">
          <h2 className="text-xl font-bold mb-1 text-purple-700">Assign Voucher</h2>
          <p className="text-sm text-gray-400 mb-5">Create a personal voucher for a customer</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Selection */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Customer</p>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or phone..."
                className="w-full border border-gray-200 p-2 rounded-lg text-sm mb-3 focus:outline-none focus:border-purple-400"
              />
              {selectedUser ? (
                <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700 text-xs flex-shrink-0">
                    {(selectedUser.name || selectedUser.email || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{selectedUser.name || "—"}</p>
                    <p className="text-xs text-gray-400 truncate">{selectedUser.email}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedUser(null)} className="text-xs text-red-400 hover:text-red-600 font-medium">Change</button>
                </div>
              ) : (
                <div className="max-h-44 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-400 text-xs py-5">No customers found</p>
                  ) : filteredUsers.slice(0, 30).map((u) => (
                    <button key={u._id} type="button" onClick={() => { setSelectedUser(u); setSearch(""); }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-purple-50 text-left transition">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {(u.name || u.email || "?")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{u.name || "—"}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voucher Details */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Voucher Details</p>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Code</label>
                <div className="flex gap-2">
                  <input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-200 p-2 rounded-lg text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-purple-400" required />
                  <button type="button" onClick={() => set("code", generateCode())}
                    className="px-3 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 font-medium transition">Auto</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Type</label>
                <div className="flex gap-1.5">
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <button key={key} type="button" onClick={() => set("type", key)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${form.type === key ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {form.type !== "freedelivery" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Value {form.type === "percentage" ? "(%)" : "(QAR)"}</label>
                    <input type="number" value={form.value} onChange={(e) => set("value", e.target.value)}
                      placeholder={form.type === "percentage" ? "e.g. 15" : "e.g. 50"}
                      className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:border-purple-400" required />
                  </div>
                  {form.type === "percentage" && (
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Max Discount (QAR)</label>
                      <input type="number" value={form.maxDiscount} onChange={(e) => set("maxDiscount", e.target.value)}
                        placeholder="Optional"
                        className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:border-purple-400" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Min Cart Value (QAR)</label>
                <input type="number" value={form.minCartValue} onChange={(e) => set("minCartValue", e.target.value)}
                  placeholder="0 = no minimum"
                  className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:border-purple-400" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Valid From</label>
                  <input type="date" value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:border-purple-400" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Expires On</label>
                  <input type="date" value={form.validTo} onChange={(e) => set("validTo", e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:border-purple-400" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Note (optional)</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="e.g. Special birthday offer!" rows={2}
                  className="w-full border border-gray-200 p-2 rounded-lg text-sm resize-none focus:outline-none focus:border-purple-400" />
              </div>
            </div>

            {/* Preview */}
            {selectedUser && form.code && (
              <div className="bg-gradient-to-r from-[#5c0603] to-[#8B1A15] rounded-xl p-4 text-white">
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Preview</p>
                <p className="text-lg font-extrabold tracking-widest mb-0.5">{form.code}</p>
                <p className="text-sm opacity-80">
                  {form.type === "freedelivery" ? "Free Delivery"
                    : form.type === "percentage" ? `${form.value || "?"}% OFF${form.maxDiscount ? ` (max QAR ${form.maxDiscount})` : ""}`
                    : `QAR ${form.value || "?"} OFF`}
                </p>
                <p className="text-xs opacity-55 mt-1.5">
                  For: {selectedUser.name || selectedUser.email}
                  {form.validTo ? ` · Expires ${form.validTo}` : ""}
                </p>
              </div>
            )}

            <button type="submit" disabled={saving || !selectedUser}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition">
              {saving ? "Assigning..." : "Assign Voucher"}
            </button>
          </form>
        </div>

        {/* ── RIGHT: All assigned vouchers list ────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">All Assigned Vouchers</h2>
              <p className="text-sm text-gray-400">{vouchers.length} personal voucher{vouchers.length !== 1 ? "s" : ""} total</p>
            </div>
            <input
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              placeholder="Search code or customer..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 w-56"
            />
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
          ) : filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🎫</div>
              <p className="font-semibold text-gray-500">No assigned vouchers yet</p>
              <p className="text-sm mt-1">Assign one using the form on the left</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Discount</th>
                    <th className="px-4 py-3 text-left">Expiry</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Used</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVouchers.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-[#5c0603] tracking-wider bg-red-50 px-2 py-1 rounded text-xs">
                          {v.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {v.assignedUserId ? (
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{v.assignedUserId.name || "—"}</p>
                            <p className="text-xs text-gray-400">{v.assignedUserId.email}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{discountLabel(v)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{fmtDate(v.validTo)}</td>
                      <td className="px-4 py-3">{statusBadge(v)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-bold ${v.used > 0 ? "text-green-600" : "text-gray-400"}`}>
                          {v.used}×
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(v._id)}
                          disabled={deletingId === v._id}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                        >
                          {deletingId === v._id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default AssignVoucher;
