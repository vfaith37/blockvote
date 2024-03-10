import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
// import COVER_IMAGE1 from "../../assets/bg.jpg";
import LOGO from "../../assets/logo.png";
import { HiMoon, HiSun } from "react-icons/hi";
export default function VoterLayout() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      // console.log(12, theme);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const handleSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  console.log(theme);
  return (
    <div className="w-full h-screen dark:bg-black dark:text-white bg-white text-black flex flex-col pt-5">
       <button
          onClick={handleSwitch}
          className="text-lg font-medium items-center inline-flex cursor-pointer self-end mr-5"
        >
          {theme === "dark" ? <HiMoon size={30} /> : <HiSun size={30} />}
        </button>
      <div className="flex flex-col items-center mt-[8%]">
        <div className="flex">
          <img src={LOGO} alt="blockvote" className="h-4 mr-2 mt-2" />
          <h1 className="text-xl font-bold mr-auto">blockvote</h1>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
