import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};


const MainLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate, token]);

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out px-8 py-[54px]",
          isSidebarOpen ? "ml-64" : "ml-24",
        )}
      >
        <div className="container mx-auto p-0">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;