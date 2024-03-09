import React from "react";
import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate("/")
    }
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen overflow-hidden text-white bg-[url('./assets/bge.png')] bg-black bg-cover bg-center">
      <div className="flex">
        <img src={LOGO} alt="blockvote" className="h-4 mr-2 mt-2" />
        <h1 className="text-xl font-bold mr-auto">blockvote</h1>
      </div>
        <p className="text-teal-600 text-[326px] font-black font-['Outfit']">404</p>
        <p className="text-neutral-400 text-2xl font-normal font-['Outfit'] tracking-wide">Let’s begin the voting process.</p>
        <button className="w-40 h-14 px-6 py-4 bg-teal-600 justify-center items-center mt-[111px]" onClick={goBack}>Back to Home</button>
    </div>
  );
};

export default ErrorPage;