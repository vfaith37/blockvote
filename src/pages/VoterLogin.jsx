import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import classNames from "classnames";
import client from "../api/client";

const voterSignInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const inputStyles =
  "w-full h-11 py-2 my-2 bg-transparent rounded-md border border-neutral-500 pl-2 dark:text-white text-black";

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
    <div className="mt-40 flex flex-col items-center w-[340px] sm:w-[420px]">
      <p className="font-bold text-4xl sm:text-5xl text-center">Voter Sign in</p>
      <p className="text-neutral-500 text-base sm:text-lg font-normal mt-3 text-center">
        Use the credentials emailed to you by your election administrator
      </p>

      <form onSubmit={handleSubmit} autoComplete="off" className="w-full mt-10">
        <p className="font-semibold text-[17px]">Email</p>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={classNames(
            inputStyles,
            errors.email && touched.email ? "border-red-500" : ""
          )}
        />
        {errors.email && touched.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}

        <p className="font-semibold text-[17px] mt-4">Password</p>
        <input
          id="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={classNames(
            inputStyles,
            errors.password && touched.password ? "border-red-500" : ""
          )}
        />
        {errors.password && touched.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full h-14 bg-teal-600 mt-8 text-white text-base font-bold disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default VoterLogin;
