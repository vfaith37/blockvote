import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";

const Forgotpassword = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col max-w-md py-12 text-[#060606]">
      <div className="rise w-full flex flex-col mb-8">
        <p className="stamp text-teal-600">account recovery</p>
        <h3 className="font-display text-4xl font-bold mt-3 tracking-tight">
          Forgot password
        </h3>
        <p className="text-base text-neutral-500 mt-3">
          Enter your email and we'll send you a link to reset your blockvote
          password.
        </p>
      </div>

      <div className="rise rise-2 w-full">
        <label htmlFor="recovery-email" className="stamp text-neutral-500">
          Email
        </label>
        <input
          id="recovery-email"
          type="email"
          autoComplete="email"
          className="w-full h-12 px-3 mt-2 text-black bg-white/70 border border-neutral-400 focus:border-teal-600 focus:outline-none transition-colors"
        />

        <button
          onClick={() => navigate("/organization", { replace: true })}
          className="btn-primary w-full h-12 mt-7 text-base"
        >
          Continue
        </button>

        <button
          onClick={() => navigate("/organization")}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-teal-600 mx-auto mt-6 bg-transparent"
        >
          <HiArrowNarrowLeft /> Back to sign in
        </button>
      </div>
    </div>
  );
};

export default Forgotpassword;
