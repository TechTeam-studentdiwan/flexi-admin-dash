import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const SimpleEditor = ({ value, onChange }) => {
  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="h-40 mb-12"
      />
    </div>
  );
};

export default SimpleEditor;
