import { FC, useEffect, useState } from "react";
import { LayoutFooter, LayoutHeader, SidebarMenu } from "@/widgets";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { TokenState } from "@/config/slice/token/slice";
import { SellerAccountStatus } from "@/model/enum";
import { WEB_ROUTER } from "@/utils/web_router";

const Layout: FC = () => {
  const navigate = useNavigate();
  const token: TokenState = useSelector((state: RootState) => state.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "default";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);
  useEffect(() => {
    if (!token.accessToken) {
      navigate(WEB_ROUTER.AUTH.LOGIN.ROOT);
    }
    if (token.status == SellerAccountStatus.NEW) {
      navigate(WEB_ROUTER.AUTH.PROFILE.ROOT);
    }
  }, [token]);

  return (
    <body className="h-screen overflow-x-hidden">
      <LayoutHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex flex-1">
        <SidebarMenu sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1">
          <ToastContainer
            autoClose={5000}
            closeButton
            className="text-sm"
            style={{ width: '350px' }}
          />
          <div className="w-[100vw]">
            <Outlet />
          </div>
        </div>
      </main>
      <LayoutFooter />
    </body>
  );
};

export default Layout;
