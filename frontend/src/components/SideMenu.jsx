import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../utils/data";
import { UserContext } from "../context/usecontext";
import { useNavigate } from "react-router-dom";

function SideMenu({ activeMenu }) {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {/* User Info */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profilephotourl && (
          <img
            src={user.profilephotourl}
            alt="User Avatar"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        )}
        <div>
          <h4 className="text-sm font-semibold text-gray-800">
            {user?.name || "User"}
          </h4>
        </div>
      </div>

      {/* Menu Items */}
      <div>
        {SIDE_MENU_DATA.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.label;

          return (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 rounded-lg transition ${
                isActive ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="text-lg" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SideMenu;
