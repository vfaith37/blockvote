import React from "react";
import { useNavigate } from "react-router";

const Forgotpassword = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col max-w-[500px] py-[40%]">
      <div className="w-full flex flex-col mb-2">
        <h3 className="text-3xl font-semibold mb-2">Forgot Password 🔒</h3>
        <p className="text-sm text-black text-opacity-50 font-normal">
          Input your email to recover password to access patty account
        </p>
      </div>

      <div className="w-full flex flex-col pt-2">
        <p className="t-black text-[13px] font-semibold">Email</p>
        <input
          type="email"
          placeholder="email"
          className="w-full h-11 text-black py-2 my-2 bg-transparent rounded-md border border-black/40 pl-2"
        />
      </div>

      <div className="w-full flex flex-col my-2">
        <button onClick={()=> navigate.replace("/signin")} className="w-full my-2 text-white bg-[#00A699] font-semibold  rounded-md p-2 text-center flex items-center justify-center">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Forgotpassword;
