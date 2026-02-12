import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 text-center max-w-md w-full border-t-8 border-purple-600">
        
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 text-purple-700 p-6 rounded-full text-5xl">
            <FaExclamationTriangle />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-purple-800 mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          Page Not Found
        </h2>

        <p className="text-purple-600 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-200 text-purple-800 py-2 rounded hover:bg-purple-300 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            <FaHome />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
