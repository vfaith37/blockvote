import React from "react";
import LOGO from "../../assets/logo.png";
import classNames from "classnames";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/const/navigation";
import { HiOutlineLogout } from "react-icons/hi";

const linkClass =
  "flex items-center gap-4 font-medium w-full h-11 px-4 hover:bg-neutral-800 hover:no-underline active:bg-neutral-700 rounded-lg text-sm transition-colors";

export default function Sidebar() {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };
  return (
    <div className="text-white bg-[#060606] border-r border-neutral-800 p-4 flex flex-col w-60">
      <div className="flex items-center gap-2.5 px-2 py-3">
        <img src={LOGO} alt="" className="h-4" />
        <h1 className="text-xl font-bold font-display tracking-tight">
          blockvote
        </h1>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 py-8">
        <p className="stamp text-neutral-500 px-2 pb-3">Dashboard</p>
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-3 border-t border-neutral-800">
        <button
          className={classNames(linkClass, "text-red-500 bg-transparent")}
          onClick={Logout}
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
}

function SidebarLink({ link }) {
  const { pathname } = useLocation();
  const isActive = pathname === link.path;

  return (
    <Link
      to={link.path}
      className={classNames(
        isActive
          ? "bg-neutral-900 text-teal-400 border-l-2 border-teal-500"
          : "text-neutral-400 border-l-2 border-transparent",
        linkClass
      )}
    >
      <span className="text-xl">{link.icon}</span>
      {link.label}
    </Link>
  );
}
