import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaShoppingCart, 
  FaFileAlt, 
  FaClipboardList, 
  FaSignOutAlt 
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Cart", path: "/cart", icon: <FaShoppingCart /> },
    { name: "Dummy 1", path: "/dummy1", icon: <FaFileAlt /> },
    { name: "Dummy 2", path: "/dummy2", icon: <FaClipboardList /> },
  ];

  return (
    <aside className="w-64 h-screen bg-secondary border-r border-gray-300 shadow-md flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="p-5 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Flexi
          </h2>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-300">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 transition-all"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
