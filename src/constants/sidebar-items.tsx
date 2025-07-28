import { MdOutlineGridView, MdOutlinePermIdentity  } from "react-icons/md";
import { GoGitBranch } from "react-icons/go";
import { CgFileDocument } from "react-icons/cg";


const SIDEBAR_ITEMS = [
  {
    title: "Ads Manager",
    path: "/dashboard",
    icon: <MdOutlineGridView size={24} />,
  },
  {
    title: "Audiences",
    path: "/audiences",
    icon: <MdOutlinePermIdentity size={24} />,
  },
  {
    title: "Integrations",
    path: "/connections",
    icon: <GoGitBranch size={24} />,
  },
  {
    title: "Pages",
    path: "/pages",
    icon: <CgFileDocument size={24} />,
  },
];

export default SIDEBAR_ITEMS;