import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { BACKEND_URL } from "../../store/url";
import { FaTrash, FaEdit, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

const cfg = { withCredentials: true };

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [form, setForm] = useState({ name: "", deliveryFee: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/areas/all`, cfg);
      setAreas(res.data.areas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAreas(); }, []);

  const openAdd = () => {
    setEditingArea(null);
    setForm({ name: "", deliveryFee: "", isActive: true });
    setError("");
    setShowForm(true);
  };

  const openEdit = (area) => {
    setEditingArea(area);
    setForm({ name: area.name, deliveryFee: area.deliveryFee, isActive: area.isActive });
    setError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.deliveryFee === "") {
      setError("Name and delivery fee are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), deliveryFee: Number(form.deliveryFee), isActive: form.isActive };
      if (editingArea) {
        await axios.put(`${BACKEND_URL}/areas/update/${editingArea._id}`, payload, cfg);
      } else {
        await axios.post(`${BACKEND_URL}/areas/create`, payload, cfg);
      }
      setShowForm(false);
      fetchAreas();
    } catch (err) {
      setError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this area? Orders with this area will fall back to the global delivery fee.")) return;
    try {
      await axios.delete(`${BACKEND_URL}/areas/delete/${id}`, cfg);
      fetchAreas();
    } catch {
      alert("Failed to delete area.");
    }
  };

  const toggleActive = async (area) => {
    try {
      await axios.put(`${BACKEND_URL}/areas/update/${area._id}`, { isActive: !area.isActive }, cfg);
      fetchAreas();
    } catch {
      alert("Failed to update area.");
    }
  };

  return (
    <Layout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Delivery Areas</h1>
            <p className="text-sm text-gray-500 mt-1">Set delivery fees per area in Doha, Qatar</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FaPlus /> Add Area
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">{editingArea ? "Edit Area" : "Add New Area"}</h2>

              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Area Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Al Wakra, Al Khor, Lusail..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Delivery Fee (QAR) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    value={form.deliveryFee}
                    onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible to customers)</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading areas...</div>
          ) : areas.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-lg font-medium">No areas yet</p>
              <p className="text-sm mt-1">Add delivery areas for Doha, Qatar</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">Area Name</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">Delivery Fee</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {areas.map((area) => (
                  <tr key={area._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium text-gray-800">{area.name}</td>
                    <td className="px-5 py-4 text-gray-700">QAR {area.deliveryFee}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(area)}
                        className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold transition ${
                          area.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {area.isActive ? <><FaCheck size={10} /> Active</> : <><FaTimes size={10} /> Inactive</>}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(area)} className="text-purple-600 hover:text-purple-800 transition">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(area._id)} className="text-red-500 hover:text-red-700 transition">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          * Delivery fee is applied per customer's selected area. Falls back to global fee from Profile if no area matched.
        </p>
      </div>
    </Layout>
  );
};

export default Areas;
