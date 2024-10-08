import React from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CubeTransparentIcon, PresentationChartBarIcon, ShoppingBagIcon, InboxIcon, UserCircleIcon, Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { WEB_ROUTER } from "@/utils/web_router";

interface SidebarMenuProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarMenu = ({ sidebarOpen, toggleSidebar }: SidebarMenuProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-base-100 shadow-lg z-50 transition-transform transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:block md:h-fit md:max-w-xs md:translate-x-0 md:shadow-xl md:p-4 lg:min-w-64`}
    >
      <div className="mb-2 p-4">
        <button className="md:hidden" onClick={toggleSidebar}>
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h5 className="text-center text-lg font-semibold text-gray-800">CMS</h5>

      </div>
      <ul className="menu bg-base-200 rounded-box">
        {/* Dashboard Accordion */}
        <li>
          <div onClick={() => handleOpen(1)} className="flex justify-between items-center">
            <span className="flex">
              <PresentationChartBarIcon className="w-5 h-5 mr-2" />
              Dashboard
            </span>
            <ChevronDownIcon className={`h-4 w-4 transform ${open === 1 ? "rotate-180" : ""}`} />
          </div>
          {open === 1 && (
            <ul className="pl-1">
              <li><a>Analytics</a></li>
              <li><a>Reporting</a></li>
              <li><a>Projects</a></li>
            </ul>
          )}
        </li>
        {/* Account Accordion */}
        <li>
          <div onClick={() => handleOpen(2)} className="flex justify-between items-center">
            <span className="flex">
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              {t("menu.accountManager")}
            </span>
            <ChevronDownIcon className={`h-4 w-4 transform ${open === 2 ? "rotate-180" : ""}`} />
          </div>
          {open === 2 && (
            <ul className="pl-1">
              <li><a href={WEB_ROUTER.LIST_ACCOUNT}>{t("menu.listAccount")}</a></li>
            </ul>
          )}
        </li>
        {/* Project Accordion */}
        <li>
          <div onClick={() => handleOpen(3)} className="flex justify-between items-center">
            <span className="flex">
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              {t("menu.projectManager")}
            </span>
            <ChevronDownIcon className={`h-4 w-4 transform ${open === 2 ? "rotate-180" : ""}`} />
          </div>
          {open === 3 && (
            <ul className="pl-1">
              <li><a href={WEB_ROUTER.LIST_PROJECT}>{t("menu.listProject")}</a></li>
            </ul>
          )}
        </li>
        <div className="divider"></div>
        <li><a><InboxIcon className="w-5 h-5 mr-2" /> Inbox <span className="badge badge-neutral ml-auto">14</span></a></li>
        <li><a><UserCircleIcon className="w-5 h-5 mr-2" /> Profile</a></li>
        <li><a><Cog6ToothIcon className="w-5 h-5 mr-2" /> Settings</a></li>
        <li><a><PowerIcon className="w-5 h-5 mr-2" /> Log Out</a></li>
      </ul>
      {openAlert && (
        <div className="alert alert-info mt-4 flex justify-between items-start">
          <CubeTransparentIcon className="w-12 h-12" />
          <div className="ml-4">
            <h6 className="font-semibold">Upgrade to PRO</h6>
            <p className="text-sm">Get even more features with the PRO version of this dashboard.</p>
            <div className="mt-2">
              <button className="btn btn-xs btn-link text-blue-500" onClick={() => setOpenAlert(false)}>Dismiss</button>
              <button className="btn btn-xs btn-primary ml-2">Upgrade Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
