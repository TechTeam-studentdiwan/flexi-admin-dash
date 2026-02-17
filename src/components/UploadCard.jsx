import { useState, useEffect } from "react";
import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/duipcpitb/image/upload";
const UPLOAD_PRESET = "sms-preset";

const UploadCard = ({
  label = "Upload Image",
  value,
  onChange,
  folder = "flexi_uploads",
  height = "h-40",
}) => {
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ IMPORTANT FIX
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData, {
        onUploadProgress: (event) => {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgress(percent);
        },
      });

      const url = res.data.secure_url;
      setPreview(url);
      onChange?.(url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange?.("");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition bg-white ${height}`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {!preview && !uploading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-sm">Click to upload</p>
          </div>
        )}

        {uploading && (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-linear-to-r from-pink-500 to-purple-600 h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-purple-600">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {preview && !uploading && (
          <div className="relative h-full group">
            <img
              src={preview}
              alt="Preview"
              className="h-full mx-auto rounded-lg object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
