import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { BACKEND_URL } from "../../store/url";
import { FaTrash, FaEdit, FaPlus, FaFileAlt, FaArrowLeft } from "react-icons/fa";
import RichTextEditor from "../../components/AdminEditor";

const cfg = { withCredentials: true };

const TermsPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "form"
  const [editingPage, setEditingPage] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", order: 0, isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/terms-pages/admin/all`, cfg);
      setPages(res.data.pages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const openAdd = () => {
    setEditingPage(null);
    setForm({ title: "", content: "", order: pages.length, isActive: true });
    setError("");
    setView("form");
  };

  const openEdit = (page) => {
    setEditingPage(page);
    setForm({ title: page.title, content: page.content, order: page.order, isActive: page.isActive });
    setError("");
    setView("form");
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.content || form.content === "<p></p>") { setError("Content is required."); return; }
    setSaving(true);
    try {
      const payload = { title: form.title.trim(), content: form.content, order: Number(form.order) || 0, isActive: form.isActive };
      if (editingPage) {
        await axios.put(`${BACKEND_URL}/terms-pages/update/${editingPage._id}`, payload, cfg);
      } else {
        await axios.post(`${BACKEND_URL}/terms-pages/create`, payload, cfg);
      }
      setView("list");
      fetchPages();
    } catch (err) {
      setError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this terms page?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/terms-pages/delete/${id}`, cfg);
      fetchPages();
    } catch {
      alert("Failed to delete page.");
    }
  };

  const toggleActive = async (page) => {
    try {
      await axios.put(`${BACKEND_URL}/terms-pages/update/${page._id}`, { isActive: !page.isActive }, cfg);
      fetchPages();
    } catch {
      alert("Failed to update page.");
    }
  };

  if (view === "form") {
    return (
      <Layout>
        <div className="mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
              <FaArrowLeft /> Back to list
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {editingPage ? `Edit: ${editingPage.title}` : "New Terms Page"}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-600">Page Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Refund Policy, Privacy Policy..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Lower number = shown first</p>
              </div>
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

            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-2">Page Content *</label>
              <RichTextEditor
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                minHeight={350}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : editingPage ? "Save Changes" : "Create Page"}
              </button>
              <button
                onClick={() => setView("list")}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Terms & Conditions Pages</h1>
            <p className="text-sm text-gray-500 mt-1">Each page appears as a separate policy in the app</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FaPlus /> Add Page
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border p-12 text-center text-gray-400">Loading...</div>
        ) : pages.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-500">No terms pages yet</p>
            <p className="text-sm text-gray-400 mt-1">Create pages like "Refund Policy", "Privacy Policy", etc.</p>
            <button onClick={openAdd} className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">
              Create First Page
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map((page, idx) => (
              <div key={page._id} className="bg-white rounded-xl border shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition">
                {/* Order badge */}
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {page.order ?? idx + 1}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <FaFileAlt className="text-purple-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{page.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(page.updatedAt).toLocaleDateString("en-QA", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>

                {/* Status */}
                <button
                  onClick={() => toggleActive(page)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition flex-shrink-0 ${
                    page.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {page.isActive ? "Active" : "Hidden"}
                </button>

                {/* Actions */}
                <button onClick={() => openEdit(page)} className="text-purple-600 hover:text-purple-800 transition p-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(page._id)} className="text-red-500 hover:text-red-700 transition p-2">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-5">
          * Pages appear in order in the app's Terms & Conditions section. Toggle "Active" to show/hide individual pages.
        </p>
      </div>
    </Layout>
  );
};

export default TermsPages;
