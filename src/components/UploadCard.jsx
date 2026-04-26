import { useState, useEffect, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please drop an image file.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);
    try {
      const res = await axios.post(CLOUDINARY_URL, formData, {
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
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

  const handleInputChange = (e) => uploadFile(e.target.files?.[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl text-center transition-all bg-white cursor-pointer ${height}
          ${isDragging
            ? "border-purple-500 bg-purple-50 scale-[1.01]"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {!preview && !uploading && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 pointer-events-none">
            <svg className={`w-10 h-10 transition-colors ${isDragging ? "text-purple-500" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {isDragging ? (
              <p className="text-sm font-semibold text-purple-600">Drop to upload</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600">Drag & drop or <span className="text-purple-600 font-semibold">click to browse</span></p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
              </>
            )}
          </div>
        )}

        {uploading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 pointer-events-none px-6">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-purple-600 font-medium">Uploading… {progress}%</p>
          </div>
        )}

        {preview && !uploading && (
          <div className="relative h-full group">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full mx-auto rounded-xl object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition font-semibold shadow"
            >
              Remove
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
              Click or drag to replace
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
