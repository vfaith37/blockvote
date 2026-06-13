import React from "react";
import { Outlet } from "react-router-dom";
import COVER_IMAGE1 from "../../assets/bg.jpg";
import LOGO from "../../assets/logo.png";
import { HiOutlineShieldCheck } from "react-icons/hi";

export default function AuthLayout() {
  return (
    <div className="w-full min-h-dvh flex items-stretch">
      {/* Form panel */}
      <div className="w-full lg:w-1/2 bg-[#F6F5F1] flex flex-col p-8 sm:p-12 overflow-y-auto">
        <div className="flex items-center gap-2.5">
          <img src={LOGO} alt="" className="h-4" />
          <h1 className="text-xl text-[#060606] font-bold font-display tracking-tight">
            blockvote
          </h1>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <Outlet />
        </div>
        <p className="flex items-center justify-center gap-2 text-neutral-400 pt-6">
          <HiOutlineShieldCheck size={14} className="text-teal-600" />
          <span className="stamp">election administration console</span>
        </p>
      </div>

      {/* Cover panel */}
      <div className="hidden lg:block relative w-1/2">
        <img
          src={COVER_IMAGE1}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-14">
          <p className="stamp text-teal-400">verifiable by design</p>
          <h2 className="font-display text-4xl xl:text-5xl text-white font-bold mt-4 tracking-tight leading-tight">
            Run elections people can{" "}
            <span className="text-teal-400">trust</span>.
          </h2>
          <p className="text-lg text-neutral-300 font-normal mt-5 max-w-lg leading-relaxed">
            A specialized voting platform based on the blockchain, designed for
            voters and candidates — facilitating a smooth electoral process
            across multiple channels.
          </p>
        </div>
      </div>
    </div>
  );
}
