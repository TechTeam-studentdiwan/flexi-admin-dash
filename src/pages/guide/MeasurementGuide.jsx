import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { BACKEND_URL } from "../../store/url";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import UploadCard from "../../components/UploadCard";

const cfg = { withCredentials: true };

const emptyForm = { stepNumber: "", title: "", description: "", imageUrl: "", isActive: true };

const MeasurementGuide = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSteps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/measurement-guide/steps/all`, cfg);
      setSteps(res.data.steps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSteps(); }, []);

  const openAdd = () => {
    setEditingStep(null);
    const nextStep = steps.length > 0 ? Math.max(...steps.map((s) => s.stepNumber)) + 1 : 1;
    setForm({ ...emptyForm, stepNumber: String(nextStep) });
    setError("");
    setShowForm(true);
  };

  const openEdit = (step) => {
    setEditingStep(step);
    setForm({
      stepNumber: String(step.stepNumber),
      title: step.title,
      description: step.description,
      imageUrl: step.imageUrl || "",
      isActive: step.isActive,
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.stepNumber) {
      setError("Step number, title and description are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        stepNumber: Number(form.stepNumber),
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        isActive: form.isActive,
      };
      if (editingStep) {
        await axios.put(`${BACKEND_URL}/measurement-guide/steps/${editingStep._id}`, payload, cfg);
      } else {
        await axios.post(`${BACKEND_URL}/measurement-guide/steps`, payload, cfg);
      }
      setShowForm(false);
      fetchSteps();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this guide step?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/measurement-guide/steps/${id}`, cfg);
      fetchSteps();
    } catch {
      alert("Failed to delete step.");
    }
  };

  const toggleActive = async (step) => {
    try {
      await axios.put(`${BACKEND_URL}/measurement-guide/steps/${step._id}`, { isActive: !step.isActive }, cfg);
      fetchSteps();
    } catch {
      alert("Failed to update step.");
    }
  };

  return (
    <Layout>
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Measurement Guide</h1>
            <p className="text-sm text-gray-500 mt-1">Manage step-by-step measurement tutorial shown to customers</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FaPlus /> Add Step
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{editingStep ? "Edit Step" : "Add New Step"}</h2>

              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Step Number *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.stepNumber}
                    onChange={(e) => setForm({ ...form, stepNumber: e.target.value })}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Measuring Your Bust"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Explain how to take this measurement..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <UploadCard
                    label="Step Image"
                    value={form.imageUrl}
                    onChange={(url) => setForm({ ...form, imageUrl: url })}
                    folder="measurement_guide"
                    height="h-48"
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

        {/* Steps List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Loading steps...</div>
          ) : steps.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center text-gray-400">
              <p className="text-lg font-medium">No guide steps yet</p>
              <p className="text-sm mt-1">Add step-by-step instructions to help customers measure themselves</p>
            </div>
          ) : (
            steps.map((step) => (
              <div key={step._id} className="bg-white rounded-2xl shadow-sm border p-4 flex gap-4 items-start">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  {step.imageUrl ? (
                    <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">No image</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      Step {step.stepNumber}
                    </span>
                    <button
                      onClick={() => toggleActive(step)}
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold transition ${
                        step.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {step.isActive ? "Active" : "Hidden"}
                    </button>
                  </div>
                  <p className="font-semibold text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{step.description}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button onClick={() => openEdit(step)} className="text-purple-600 hover:text-purple-800 transition p-1">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(step._id)} className="text-red-500 hover:text-red-700 transition p-1">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MeasurementGuide;
