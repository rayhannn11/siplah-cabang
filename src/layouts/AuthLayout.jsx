import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/sidebar";
// import SearchModal from "../components/modals/search-modal";
import { useEffect, useState } from "react";
import useResponsive from "../hooks/useResponsive";
import { Menu } from "lucide-react";
import TourGuide from "../components/tour-guide";

export function AuthLayout() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isMobile, isDesktop]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      {/* Tour trigger */}
      <TourGuide />
      {/* Topbar hanya tampil di mobile */}
      {(isMobile || isTablet) && (
        <div className="flex items-center justify-between px-4 h-14 bg-[#0a1f3c] text-white">
          {/* Hamburger */}
          <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <img
            src="https://cdn.eurekabookhouse.co.id/ebh/mall/logo_siplah_seller.png"
            alt="SIPLAH"
            className="h-12 object-contain"
          />

          {/* Spacer biar logo tetap center */}
          <div className="w-6" />
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex h-screen  overflow-hidden ">
        {/* Sidebar */}

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={isMobile}
        />

        {/* Main Section */}
        <div
          className={`flex flex-col flex-1 h-auto transition-all duration-300 bg-[#ECF0F5] overflow-y-auto `}
        >
          {" "}
          {/* Main content */}
          <main className={`flex-1 h-full bg-[#ECF0F5]`}>
            <div className="min-h-screen">
              <Outlet />
            </div>

            <footer className="flex flex-col md:flex-row justify-center items-center gap-2 bg-[#ECF0F5] py-6 text-sm md:text-base shadow-md">
              <p className="text-center md:text-left">
                <span className="font-bold">Copyright © 2019 - 2025</span>{" "}
                <span className="font-bold text-blue-600">SIPLah</span>. All
                rights reserved.
              </p>
            </footer>
          </main>
          {/* Footer */}
        </div>

        {/* <main className="flex-1 overflow-auto flex flex-col">
          <div className="flex flex-col min-h-full bg-[#ECF0F5] ">
            <div className="flex-1">
              <Outlet />
            </div>

            <footer className="flex flex-col md:flex-row justify-between items-center gap-2 bg-white p-4 text-sm md:text-base">
              <p className="text-center md:text-left">
                <span className="font-bold">Copyright © 2009 - 2025</span>{" "}
                <span className="font-bold text-blue-600">SIPLah</span>. All
                rights reserved.
              </p>
              <p className="text-center md:text-right">
                Version <span className="font-bold">1.0.0</span>
              </p>
            </footer>
          </div>
        </main> */}
      </div>
    </div>
  );
}
