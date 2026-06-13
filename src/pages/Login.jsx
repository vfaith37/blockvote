import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signInSchema } from "../schemas";
import classNames from "classnames";
import { HiArrowNarrowRight } from "react-icons/hi";
import client from "../api/client";
import { hasValidOrgSession } from "../api/auth";

const inputStyles =
  "w-full h-12 px-3 mt-2 text-black bg-white/70 border border-neutral-400 " +
  "placeholder:text-neutral-400 focus:border-teal-600 focus:outline-none transition-colors";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    setError(null);
    try {
      const res = await client.post("organization/signin", { ...values });

      if (res.data.organization.isVerified === true && res.status === 200) {
        let token = res.data.token;
        let refreshToken = res.data.refreshToken;
        let userinfo = res.data.organization;
        if (token != null && userinfo != null) {
          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("rememberMe", rememberMe);
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("userInfo", JSON.stringify(userinfo));
          localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
          navigate("/dashboard", { replace: true });
        }
      } else if (
        res.data.organization.isVerified === false &&
        res.status === 200
      ) {
        let userinfo = res.data.organization;
        localStorage.setItem("userInfo", JSON.stringify(userinfo));
        navigate("/organization/otp", {
          replace: true,
          state: { username: values.email, password: values.password },
        });
      }
    } catch (e) {
      setError(
        (e.response && e.response.data && e.response.data.message) ||
          "Unable to sign in. Please check your credentials."
      );
    }
    actions.setSubmitting(false);
  };

  useEffect(() => {
    // Skip the login screen only when there is a still-valid session, not just
    // because "remember me" was once ticked.
    if (hasValidOrgSession()) {
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit,
  });

  return (
    <div className="w-full flex flex-col max-w-md py-12 text-[#060606]">
      <div className="rise w-full flex flex-col mb-8">
        <p className="stamp text-teal-600">organization access</p>
        <h3 className="font-display text-4xl font-bold mt-3 tracking-tight">
          Welcome back
        </h3>
        <p className="text-base font-normal text-neutral-500 mt-3">
          Don't have an account?
          <Link to="signup" className="hover:no-underline">
            <span className="text-teal-600 font-semibold cursor-pointer">
              {" "}
              Sign up
            </span>
          </Link>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="rise rise-2 w-full"
      >
        <label htmlFor="email" className="stamp text-neutral-500 block">
          Email
        </label>
        <input
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          id="email"
          type="email"
          autoComplete="email"
          className={classNames(
            inputStyles,
            errors.email && touched.email ? "border-red-500" : ""
          )}
        />
        {errors.email && touched.email && (
          <p className="text-red-600 text-sm mt-1.5">{errors.email}</p>
        )}

        <label
          htmlFor="password"
          className="stamp text-neutral-500 block mt-6"
        >
          Password
        </label>
        <input
          id="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          type="password"
          autoComplete="current-password"
          className={classNames(
            inputStyles,
            errors.password && touched.password ? "border-red-500" : ""
          )}
        />
        {errors.password && touched.password && (
          <p className="text-red-600 text-sm mt-1.5">{errors.password}</p>
        )}

        <div className="w-full flex items-center justify-between mt-6">
          <label className="flex items-center cursor-pointer">
            <input
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              type="checkbox"
              className="w-4 h-4 mr-2 accent-teal-600"
            />
            <span className="text-sm">Remember me</span>
          </label>
          <Link to="forgotpassword" className="hover:no-underline">
            <span className="text-sm font-medium text-neutral-500 hover:text-teal-600 cursor-pointer">
              Forgot password?
            </span>
          </Link>
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
          disabled={isSubmitting}
          type="submit"
          className="btn-primary w-full h-12 mt-8 text-base"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          {!isSubmitting && <HiArrowNarrowRight />}
        </button>
      </form>

      <p className="rise rise-3 text-sm text-neutral-500 mt-8 text-center">
        Voting in an election?{" "}
        <Link to="/voters/login" className="hover:no-underline">
          <span className="text-teal-600 font-semibold">Voter sign in</span>
        </Link>
      </p>
    </div>
  );
};

export default Login;
