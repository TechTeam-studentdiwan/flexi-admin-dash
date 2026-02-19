import { FaTimes } from "react-icons/fa";

const SideDrawer = ({
  isOpen,
  onClose,
  title,
  width = "w-[450px]",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/25 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full ${width} bg-white shadow-xl z-50 flex flex-col transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-semibold text-purple-700">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="hover:scale-110 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
