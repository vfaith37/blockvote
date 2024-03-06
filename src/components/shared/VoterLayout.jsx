import React from "react";
import { Outlet } from "react-router-dom";
// import COVER_IMAGE1 from "../../assets/bg.jpg";
import LOGO from "../../assets/logo.png";
export default function VoterLayout() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="flex">
          <img src={LOGO} alt="blockvote" className="h-4 mr-2 mt-2" />
          <h1 className="text-xl font-bold mr-auto">
            blockvote
          </h1>
        </div>
        <div>
          <Outlet />
        </div>
    </div>
  );
}
