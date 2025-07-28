import { cn } from "@/lib/utils";
import SidebarItem from "./SidebarItem";
import SIDEBAR_ITEMS from "@/constants/sidebar-items";
import { useLocation } from "react-router-dom";
import Logo from "@/assets/logo.svg";
import LogoIcon from "@/assets/logo-icon.svg";
import {
  IoIosSkipBackward,
  IoIosSkipForward,
  IoMdPerson,
} from "react-icons/io";
import { MdOutlineUpgrade } from "react-icons/md";
import { Separator } from "@/components/ui/separator";

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col bg-white py-10 rounded-r-xl",
        isSidebarOpen ? "w-64" : "w-[100px]",
        isSidebarOpen ? "px-6" : "px-[26px]"
      )}
    >
      {isSidebarOpen ? (
        <div className="flex items-center justify-between">
          <img src={Logo} alt="cliquify logo" />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <img src={LogoIcon} alt="cliquify logo icon" />
        </div>
      )}

      <div className="flex flex-col gap-5 overflow-y-auto flex-1 mt-[60px]">
        {isSidebarOpen ? (
          <button
            onClick={toggleSidebar}
            className="text-[#767EAD] flex items-center justify-end"
          >
            <IoIosSkipBackward size={20} />
          </button>
        ) : (
          <button onClick={toggleSidebar} className="text-[#767EAD] mx-auto">
            <IoIosSkipForward size={20} />
          </button>
        )}
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            title={isSidebarOpen ? item.title : ""}
            path={item.path}
            isActive={
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path))
            }
          />
        ))}

        <Separator className="bg-[#BBCFDD]" />
      </div>

      {isSidebarOpen ? (
        <section
          className="bg-lightGrayColor rounded-xl p-2 flex items-center justify-between cursor-pointer"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white w-8 h-8 p-2 rounded-xl flex items-center justify-center">
              <IoMdPerson className="text-iconColor" />
            </div>
            <span className="font-medium text-xs text-blackColor">
              James Johns
            </span>
          </div>
          <MdOutlineUpgrade size={24} className="text-iconColor rotate-90" />
        </section>
      ) : (
        <div
          className="w-12 h-12 flex items-center justify-center bg-lightGrayColor rounded-xl cursor-pointer"
          onClick={handleLogout}
        >
          <IoMdPerson className="text-iconColor" size={24} />
        </div>
      )}

      {/* <button
        onClick={() => {
          // Remove token from localStorage and reload or redirect
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/";
        }}
        className="mt-auto mb-4 mx-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button> */}
    </aside>
  );
};

export default Sidebar;
