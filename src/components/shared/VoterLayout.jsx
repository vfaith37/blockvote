import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LOGO from "../../assets/logo.png";
import { HiMoon, HiSun, HiOutlineShieldCheck } from "react-icons/hi";

export default function VoterLayout() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      localStorage.setItem("theme", theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSwitch = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="bg-ledger w-full min-h-dvh dark:text-white text-neutral-900 flex flex-col">
      <header className="flex items-center justify-between px-6 sm:px-10 pt-6">
        <div className="flex items-center gap-2.5">
          <img src={LOGO} alt="" className="h-4" />
          <span className="text-xl font-bold font-display tracking-tight">
            blockvote
          </span>
        </div>
        <button
          onClick={handleSwitch}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="p-2 rounded-full text-neutral-500 hover:text-teal-500"
        >
          {theme === "dark" ? <HiMoon size={24} /> : <HiSun size={24} />}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-6">
        <Outlet />
      </main>

      <footer className="flex items-center justify-center gap-2 py-6 text-neutral-500">
        <HiOutlineShieldCheck size={15} className="text-teal-600" />
        <span className="stamp">every ballot sealed on-chain</span>
      </footer>
    </div>
  );
}
