import React, { useEffect } from "react";
import { Navigate, Outlet} from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  let nav = localStorage.getItem("isAuthenticated");
  console.log(nav);
  return (
    <div className="flex flex-row bg-black h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          {nav !== "true" ? <Navigate to={"/"} replace /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}
