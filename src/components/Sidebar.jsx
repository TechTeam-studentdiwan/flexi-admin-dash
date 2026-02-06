import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const menuItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Cart", path: "/cart" },
    { name: "Dummy 1", path: "/dummy1" },
    { name: "Dummy 2", path: "/dummy2" },
  ];

  return (
    <div className="w-60 h-screen bg-gray-900 text-white flex flex-col justify-between shadow-lg">
      <div>
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-center">Flexi</h2>
        </div>

        <ul className="mt-4 space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded-md transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-blue-200 text-gray-500"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
