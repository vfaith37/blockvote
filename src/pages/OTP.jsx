import classNames from "classnames";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { otpSchema } from "../schemas";
import client from "../api/client";

const otpInput =
  "w-14 h-14 sm:w-16 sm:h-16 text-center font-mono text-2xl text-black bg-white/70 " +
  "border border-neutral-400 focus:border-teal-600 focus:outline-none transition-colors uppercase";

const OTP = () => {
  const location = useLocation();
  const { username, password } = location.state;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const Data = {
    email: username,
    password: password,
  };

  const onSubmit = async (values) => {
    const otpCode =
      values.otp1 + values.otp2 + values.otp3 + values.otp4 + values.otp5;

    setError(null);
    try {
      const res = await client.post("organization/verifyUser", {
        token: otpCode,
      });
      if (res.status === 200 && res.data.success === true) {
        const signin = await client.post("organization/signin", Data);

        if (signin.status === 200) {
          let token = signin.data.token;
          let refreshToken = signin.data.refreshToken;
          let userinfo = signin.data.organization;
          if (token != null && userinfo != null) {
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
            localStorage.setItem("userInfo", JSON.stringify(userinfo));
            navigate("/dashboard", { replace: true });
          }
        }
      }
    } catch (e) {
      setError(
        (e.response && e.response.data && e.response.data.message) ||
          "Verification failed. Check the code and try again."
      );
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
    },
    validationSchema: otpSchema,
    onSubmit,
  });

  return (
    <div className="w-full flex flex-col max-w-md py-12 text-[#060606]">
      <div className="rise w-full flex flex-col mb-8">
        <p className="stamp text-teal-600">verify your email</p>
        <h3 className="font-display text-4xl font-bold mt-3 tracking-tight">
          Enter your code
        </h3>
        <p className="text-base text-neutral-500 mt-3">
          We emailed a one-time password to{" "}
          <span className="font-semibold text-neutral-700">{username}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} autoComplete="off" className="rise rise-2">
        <div className="flex flex-row items-center justify-between gap-2">
          {["otp1", "otp2", "otp3", "otp4", "otp5"].map((id) => (
            <input
              key={id}
              type="text"
              inputMode="numeric"
              id={id}
              aria-label={`Digit ${id.slice(-1)} of 5`}
              className={classNames(
                otpInput,
                errors[id] && touched[id] && "border-red-500"
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values[id]}
              maxLength={1}
            />
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="text-red-600 text-sm mt-5 text-center border border-red-300 bg-red-50 px-3 py-2"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full h-12 mt-8 text-base"
        >
          {isSubmitting ? "Verifying..." : "Continue"}
        </button>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Didn't receive a code?
          <span className="text-teal-600 font-semibold cursor-pointer">
            {" "}
            Resend
          </span>
        </p>
      </form>
    </div>
  );
};

export default OTP;
