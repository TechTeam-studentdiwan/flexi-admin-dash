import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaShoppingBag,
  FaChartLine,
  FaUsers,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Products", path: "/cart", icon: <FaBoxOpen /> },
    { name: "Sold Items", path: "/sold-items", icon: <FaShoppingBag /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartLine /> },
    { name: "Customers", path: "/customers", icon: <FaUsers /> },
    { name: "Orders", path: "/orders", icon: <FaClipboardList /> }
  ];

  return (
    <aside className="w-64 h-screen bg-purple-100 border-r border-purple-200 shadow-md flex flex-col justify-between">
      <div>
        <div className="p-5 border-b border-purple-200 bg-purple-100">
          <h2 className="text-2xl font-bold text-center text-purple-800">
            Flexi
          </h2>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-purple-200 text-purple-800 font-semibold"
                        : "text-purple-700 hover:bg-purple-100"
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
      <div className="p-4 border-t border-purple-200 flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center justify-center bg-purple-100 text-purple-700 p-2 rounded-md hover:bg-purple-200 transition-all"
        >
          <FaUserCircle className="text-xl" />
        </button>

        <button
          onClick={logout}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-md hover:bg-purple-200 transition-all"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
