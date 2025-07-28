import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type SidebarItemProps = {
  icon: ReactNode;
  title: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
};

const SidebarItem = ({
  icon,
  title,
  path,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg transition-colors",
        isActive
          ? "bg-[#DEE4ED] text-mainColor font-medium"
          : "text-grayColor hover:bg-gray-100"
      )}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span>{title}</span>
    </Link>
  );
};

export default SidebarItem;