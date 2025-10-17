import { NavLink } from "react-router-dom";
import { adminNavigation } from "../../data/sidebar"; // path config kamu
import useResponsive from "../../hooks/useResponsive";
import { useState } from "react";
import { useAuthStore } from "../../stores";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Swal from "sweetalert2";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { logout, user } = useAuthStore();

  const [openMenu, setOpenMenu] = useState(null);
  const toggleMenu = (menuKey) => {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // tetap pakai fungsi logout dari store
        localStorage.setItem("tourSeen", "false");
        logout();
      }
    });
  };

  return (
    <aside
      className={`
    ${
      !isDesktop
        ? isSidebarOpen
          ? "w-full"
          : "w-0"
        : isSidebarOpen
        ? "w-64"
        : "w-20"
    } bg-[#0a1f3c]
    text-white min-h-screen flex flex-col 
    transition-all duration-300 overflow-hidden 
  `}
    >
      {/* Logo Header */}
      {isDesktop && (
        <div
          className={`p-4 border-b border-[#555968] ${
            isSidebarOpen
              ? "flex items-center justify-between"
              : "flex flex-col items-center"
          }`}
        >
          <img
            src={
              !isMobile && !isSidebarOpen
                ? "https://siplah.eurekabookhouse.co.id/assets/front/images/icons/favicon_eureka_g7g_icon.ico"
                : "https://cdn.eurekabookhouse.co.id/ebh/mall/logo_siplah_seller.png"
            }
            alt="SIPLAH"
            className={`h-10 object-contain ${
              !isMobile && !isSidebarOpen ? "w-8" : "w-full"
            }`}
          />

          {/* Toggle Icon */}
          {isSidebarOpen ? (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-2 p-1 rounded hover:bg-[#3B3F48] transition"
            >
              <ChevronLeft size={20} className="text-white cursor-pointer" />
            </button>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mt-2 p-1 rounded hover:bg-[#3B3F48] transition"
            >
              <ChevronRight size={20} className="text-white cursor-pointer" />
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className=" overflow-y-auto p-2">
        {adminNavigation.map((section, i) => (
          <div key={i} className="mb-4">
            {isSidebarOpen && (
              <p className="px-2 text-xs font-bold text-blue-200 uppercase tracking-wide my-6">
                {section.section}
              </p>
            )}
            <ul className="mt-1 space-y-1">
              {section.items.map((item, j) => {
                const menuKey = `${i}-${j}`;
                const isOpen = openMenu === menuKey;

                // 🔹 Reusable class generator untuk NavLink
                const navLinkClass = ({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-[#FFC107] font-medium text-black"
                      : "hover:bg-[#fac831] hover:text-slate-800"
                  }`;

                return (
                  <li key={j}>
                    {/* CASE 1: Menu dengan submenu */}
                    {item.submenu ? (
                      isSidebarOpen ? (
                        <>
                          <button
                            onClick={() => toggleMenu(menuKey)}
                            className="w-full flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:bg-blue-800 focus:outline-none"
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {isSidebarOpen && <span>{item.name}</span>}
                            {isSidebarOpen && (
                              <span className="ml-auto text-sm">
                                {isOpen ? "▲" : "▼"}
                              </span>
                            )}
                          </button>

                          {/* Submenu */}
                          {isSidebarOpen && (
                            <div
                              className={`ml-6 overflow-hidden transition-all duration-600 ease-in-out ${
                                isOpen
                                  ? "max-h-96 opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <ul className="mt-1 space-y-1">
                                {item.submenu.map((sub, k) => (
                                  <li key={k}>
                                    <NavLink
                                      to={sub.href}
                                      end
                                      onClick={() => {
                                        if (isMobile) setIsSidebarOpen(false);
                                      }}
                                      className={navLinkClass}
                                      id={item.tourId}
                                    >
                                      <sub.icon className="h-4 w-4 flex-shrink-0" />
                                      {sub.name}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        // CASE 2: Sidebar collapse → redirect langsung ke submenu[0]
                        <NavLink
                          to={item.submenu[0].href}
                          end
                          onClick={() => {
                            if (isMobile) setIsSidebarOpen(false);
                          }}
                          className={navLinkClass}
                          id={item.tourId}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {isSidebarOpen && <span>{item.name}</span>}
                        </NavLink>
                      )
                    ) : item.name === "Logout" ? (
                      // CASE 3: Logout
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-md font-medium hover:bg-blue-800 cursor-pointer"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </button>
                    ) : (
                      // CASE 4: Menu biasa
                      <NavLink
                        to={item.href}
                        end // ✅ hanya aktif kalau path persis
                        onClick={() => {
                          if (isMobile) setIsSidebarOpen(false);
                        }}
                        className={navLinkClass}
                        id={item.tourId}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile hanya muncul kalau desktop/tablet & sidebar open */}
      {!isMobile && isSidebarOpen && (
        <div className="p-4 flex mb-2 items-center justify-between border-t bg-[#0a1f3c] border-[#555968]">
          {/* Container untuk image + nama */}
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn.eurekabookhouse.co.id/ebh/mall/EurekaBookhouse_foto18_37_57.png"
              alt="Profile"
              className="h-10 w-12 rounded-full bg-white"
            />
            <div>
              <p className="text-md font-semibold truncate">
                {user?.nama_perusahaan}
              </p>
              <p className="text-white font-semibold mt-1 bg-[#3B3F48] px-2 w-12 rounded-sm text-xs">
                Seller
              </p>
            </div>
          </div>

          {/* Icon Logout */}
          <button
            onClick={handleLogout} // bikin fungsi handleLogout
            className="p-2 hover:bg-[#3B3F48] rounded-md transition cursor-pointer"
          >
            <LogOut size={20} className=" text-red-400" />
          </button>
        </div>
      )}
      {/* Sidebar Footer (Collapsed) */}
      {!isMobile && !isSidebarOpen && (
        <div className="p-3 flex flex-col items-center justify-center mb-2 border-t bg-[#0a1f3c] border-[#555968] transition-all">
          <img
            src="https://cdn.eurekabookhouse.co.id/ebh/mall/EurekaBookhouse_foto18_37_57.png"
            alt="Profile"
            className="h-10 w-10 rounded-full bg-white mb-5"
          />

          {/* Tombol Logout (ikon saja) */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-[#3B3F48] rounded-md transition cursor-pointer"
            title="Logout"
          >
            <LogOut size={18} className="text-red-400" />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
