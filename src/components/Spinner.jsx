import React from "react";

const Spinner = ({ size = "sm", color = "#ffffff" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-4",
    md: "w-10 h-10 border-[5px]",
    lg: "w-16 h-16 border-[6px]",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-transparent animate-spin`}
        style={{
          borderTopColor: color,
          borderRightColor: color,
        }}
      />
    </div>
  );
};

export default Spinner;
