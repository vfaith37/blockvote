import React, { useEffect, useState } from "react";
import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";

const ErrorPage = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
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

  return (
    <div className="bg-ledger flex flex-col justify-center items-center w-full min-h-dvh dark:text-white text-neutral-900 px-6">
      <div className="rise flex items-center gap-2.5">
        <img src={LOGO} alt="" className="h-4" />
        <h1 className="text-xl font-bold font-display tracking-tight">
          blockvote
        </h1>
      </div>
      <p className="rise rise-1 font-display text-teal-500 text-[120px] sm:text-[220px] font-black leading-none mt-8">
        404
      </p>
      <p className="rise rise-2 stamp text-neutral-500 mt-2">
        this page is not on the ledger
      </p>
      <p className="rise rise-2 text-neutral-500 text-lg sm:text-xl font-normal tracking-wide mt-4 text-center">
        The page you're looking for doesn't exist or has moved.
      </p>
      <button
        className="rise rise-3 btn-primary w-44 h-14 mt-12 text-base"
        onClick={goBack}
      >
        <HiArrowNarrowLeft /> Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
