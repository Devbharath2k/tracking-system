import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

function Navbar() {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  // Optional: you can define this based on current page/route
  const activeMenu = "dashboard"; // Placeholder

  return (
    <div className="sticky top-0 z-50 bg-white backdrop-blur-[2px] border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        {/* Toggle Button for Mobile */}
        <button
          className="lg:hidden text-black"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-black">Expense Tracking</h2>
      </div>

      {/* Side Menu for Mobile */}
      {openSideMenu && (
        <div className="lg:hidden fixed top-[61px] left-0 w-64 h-screen bg-white shadow-md z-40">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
}

export default Navbar;
