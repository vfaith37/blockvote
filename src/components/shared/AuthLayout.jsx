import React from "react";
import { Outlet } from "react-router-dom";
import COVER_IMAGE1 from "../../assets/bg.jpg";
import LOGO from "../../assets/logo.png";
export default function AuthLayout() {
  return (
    // <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
    // </div>
    <div className="w-full h-screen flex items-start">
      <div className="relative mx-auto w-1/2 h-full bg-[#F5F5F5] flex flex-col p-10">
        <div className="flex">
          <img src={LOGO} alt="metamask" className="h-4 mr-2 mt-2" />
          <h1 className="text-xl text-[#060606] font-bold mr-auto">
            blockvote
          </h1>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
      <div className="w-full h-full flex flex-col">
        <div className="absolute top-[20%] left-[45%] w-[50%] flex flex-col">
          <h1 className="text-5xl text-white font-bold my-4 ml-20 justify-center align-center">
            We give the <span className="text-[#00A699]"> best</span>{" "}
            experience! 😉
          </h1>
          <p className="text-2xl text-white font-normal w-[663px] ml-[9%] py-8">
            A specialized voting platform based on the <br />
            <span className="text-[#455154] font-semibold italic">
              blockchain
            </span>{" "}
            designed for Voters and Candidates, <br />
            facilitating a smooth electoral process across multiple <br />
            channels.
          </p>
        </div>
        <img src={COVER_IMAGE1} alt="background" className="w-full h-full object-cover" />
      </div>
      {/* <img src={COVER_IMAGE} className="w-full h-full object-cover" /> */}
    </div>
  );
}
