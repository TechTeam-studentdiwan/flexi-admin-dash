import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaChartLine,
  FaUsers,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
  FaAddressBook,
} from "react-icons/fa";
import { TbCategory, TbRulerMeasure } from "react-icons/tb";
import { RiCoupon2Fill } from "react-icons/ri";
import { persistor } from "../store/store";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/auth/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      dispatch(logoutUser());
      await persistor.purge();
      alert("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Products", path: "/products", icon: <FaBoxOpen /> },
    { name: "Category", path: "/category", icon: <TbCategory /> },
    { name: "Coupons", path: "/coupons", icon: <RiCoupon2Fill /> },
    { name: "Orders", path: "/orders", icon: <FaClipboardList /> },
    // { name: "Addresses", path: "/addresses", icon: <FaAddressBook /> },
    // { name: "Measurements", path: "/measurements", icon: <TbRulerMeasure /> },
    { name: "Customers", path: "/customers", icon: <FaUsers /> },
    // { name: "Analytics", path: "/analytics", icon: <FaChartLine /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r  shadow-md flex flex-col justify-between z-50">
      {/* Top Section */}
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b  sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-extrabold text-center ">
            Flexi
          </h2>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex-1 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-purple-200 text-purple-700 font-semibold"
                        : "hover:bg-purple-100 text-gray-700"
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

      <div className="p-2 border-t bg-white">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="hover:scale-110 p-2 rounded-md transition cursor-pointer"
          >
            <FaUserCircle className="text-3xl " />
          </button>

          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 rounded-md  transition cursor-pointer"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
