import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, Globe, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type SideNavItemProps = {
  icon: ReactNode;
  title: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
};

const SideNavItem = ({
  icon,
  title,
  path,
  isActive,
  onClick,
}: SideNavItemProps) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-brand-lighterBlue text-brand-blue font-medium"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8">{icon}</div>
      <span>{title}</span>
    </Link>
  );
};

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate, token]);

  const navItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Audiences",
      path: "/audiences",
      icon: <Users size={20} />,
    },
    {
      title: "Connections",
      path: "/connections",
      icon: <Globe size={20} />,
    },
    {
      title: "Pages",
      path: "/pages",
      icon: <BookOpen size={20} />,
    },
  ];

  const renderContent = (children: ReactNode) => {
    if (!token) {
      return null;
    }

    return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col bg-white border-r border-gray-200",
            isSidebarOpen ? "w-64" : "w-16"
          )}
        >
          <div className="px-4 py-4 flex items-center border-b border-gray-200">
            {isSidebarOpen ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xl font-bold">AdCompass</span>
                <button
                  onClick={toggleSidebar}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-gray-900 mx-auto"
              >
                <Menu size={20} />
              </button>
            )}
          </div>

          <div className="px-3 py-6 flex flex-col space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => (
              <SideNavItem
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
          </div>

          <button
            onClick={() => {
              // Remove token from localStorage and reload or redirect
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/";
            }}
            className="mt-auto mb-4 mx-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "ml-64" : "ml-16"
          )}
        >
          <div className="px-4 py-4">{children}</div>
        </main>
      </div>
    );
  };

  return renderContent(children);
};

export default AppLayout;
