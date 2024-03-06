import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const navigate = useNavigate();
  let nav = localStorage.getItem("isAuthenticated");
  console.log(nav);
  // if (nav === true) {
  return (
    <div className="flex flex-row bg-black h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          {nav === true ? <Outlet /> : <Navigate to={"/"} replace/>}
        </div>
      </div>
    </div>
  );
  //   } else {
  //     // <Navigate to={"/"} />
  //     useEffect(()=>{

  // navigate("/", {replace: true})
  //     }, [])
  //   }
}
