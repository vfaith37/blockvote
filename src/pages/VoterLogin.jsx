import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import classNames from "classnames";
import { HiArrowNarrowRight, HiOutlineLockClosed } from "react-icons/hi";
import client from "../api/client";

const voterSignInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const inputStyles =
  "w-full h-12 px-3 bg-transparent border dark:border-neutral-700 border-neutral-400 " +
  "dark:text-white text-neutral-900 placeholder:text-neutral-500 " +
  "focus:border-teal-500 focus:outline-none transition-colors";

const VoterLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (values) => {
    setError(null);
    try {
      const res = await client.post("voter/login", values);

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("voterToken", res.data.token);
        localStorage.setItem("voterInfo", JSON.stringify(res.data.voter));
        navigate("/voters", { replace: true });
      }
    } catch (e) {
      const message =
        (e.response && e.response.data && e.response.data.message) ||
        "Unable to sign in. Please try again.";
      setError(message);
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
    initialValues: { email: "", password: "" },
    validationSchema: voterSignInSchema,
    onSubmit,
  });

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md py-16">
      <div className="rise w-full">
        <p className="stamp text-teal-600">voter access</p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl mt-3 tracking-tight">
          Sign in to vote
        </h1>
        <p className="text-neutral-500 text-base mt-3 leading-relaxed">
          Use the credentials emailed to you by your election administrator.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="rise rise-2 w-full mt-10 border dark:border-neutral-800 border-neutral-300 dark:bg-black/40 bg-white/60 p-7 sm:p-9"
      >
        <label htmlFor="email" className="stamp text-neutral-500 block">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={classNames(
            inputStyles,
            "mt-2",
            errors.email && touched.email ? "border-red-500" : ""
          )}
        />
        {errors.email && touched.email && (
          <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
        )}

        <label
          htmlFor="password"
          className="stamp text-neutral-500 block mt-6"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={classNames(
            inputStyles,
            "mt-2",
            errors.password && touched.password ? "border-red-500" : ""
          )}
        />
        {errors.password && touched.password && (
          <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>
        )}

        {error && (
          <p
            role="alert"
            className="text-red-500 text-sm mt-5 text-center border border-red-500/30 bg-red-500/5 px-3 py-2"
          >
            {error}
          </p>
        )}

        <button
          disabled={isSubmitting}
          type="submit"
          className="btn-primary w-full h-14 mt-8 text-base"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          {!isSubmitting && <HiArrowNarrowRight />}
        </button>
      </form>

      <p className="rise rise-3 flex items-center gap-1.5 text-neutral-500 text-xs mt-6">
        <HiOutlineLockClosed size={13} />
        Your identity never touches the blockchain — only a salted hash does.
      </p>
    </div>
  );
};

export default VoterLogin;
