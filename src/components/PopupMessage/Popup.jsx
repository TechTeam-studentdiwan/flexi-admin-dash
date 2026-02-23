const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start pt-28 justify-center">
      <div className="absolute inset-0 " onClick={onClose} />

      <div className="relative bg-purple-200 text-gray-500 px-6 py-4 rounded-lg shadow-md flex items-center gap-4">
        <span className="text-sm">{message}</span>

        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Popup;
