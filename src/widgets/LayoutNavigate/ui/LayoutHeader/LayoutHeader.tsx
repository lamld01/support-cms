import React from "react";
import { WEB_ROUTER } from "@/utils/web_router";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; 
import {  } from "@heroicons/react/24/outline"; 

interface LayoutHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean; // Add sidebarOpen prop to manage the icon state
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <div className="navbar bg-base-100">
      <button onClick={toggleSidebar} className="btn btn-ghost md:hidden">
        {sidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button> {/* Mobile menu toggle */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href={WEB_ROUTER.HOME.ROOT}>
          Ecommerce
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
            aria-label="User menu"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            aria-label="User options"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a href={WEB_ROUTER.SETTING.ROOT}>Settings</a>
            </li>
            <li>
              <a onClick={() => {/* Implement logout functionality here */ }}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LayoutHeader;
