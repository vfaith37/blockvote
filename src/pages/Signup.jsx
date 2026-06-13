import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import classNames from "classnames";
import { HiArrowNarrowRight } from "react-icons/hi";
import client from "../api/client";

const inputStyles =
  "w-full h-11 px-3 mt-1.5 text-black bg-white/70 border border-neutral-400 " +
  "placeholder:text-neutral-400 focus:border-teal-600 focus:outline-none transition-colors";

const FIELDS = [
  { id: "firstname", label: "First name", type: "text" },
  { id: "lastname", label: "Last name", type: "text" },
  { id: "name", label: "Organization", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "password", label: "Password", type: "password" },
  { id: "confirmpassword", label: "Confirm password", type: "password" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (values, actions) => {
    setError(null);
    try {
      const res = await client.post("organization/signup", { ...values });

      if (res.data.success && res.status === 200) {
        navigate("/organization/otp", {
          replace: true,
          state: { username: values.email, password: values.password },
        });
      }
    } catch (e) {
      setError(
        (e.response && e.response.data && e.response.data.message) ||
          "Unable to create your account. Please try again."
      );
    }
    actions.setSubmitting(false);
  };

  const [check, setCheck] = useState(false);
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
      firstname: "",
      lastname: "",
      name: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit,
  });

  return (
    <div className="w-full flex flex-col max-w-md py-12 text-[#060606]">
      <div className="rise w-full flex flex-col mb-7">
        <p className="stamp text-teal-600">organization access</p>
        <h3 className="font-display text-4xl font-bold mt-3 tracking-tight">
          Create your account
        </h3>
        <p className="text-base text-neutral-500 mt-3">
          Already registered?
          <Link to="/organization" className="hover:no-underline">
            <span className="text-teal-600 font-semibold cursor-pointer">
              {" "}
              Sign in
            </span>
          </Link>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="rise rise-2 w-full"
      >
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
          {FIELDS.map((field) => (
            <div
              key={field.id}
              className={
                field.id === "name" || field.id === "email"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <label htmlFor={field.id} className="stamp text-neutral-500">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[field.id]}
                className={classNames(
                  inputStyles,
                  errors[field.id] && touched[field.id]
                    ? "border-red-500"
                    : ""
                )}
              />
              {errors[field.id] && touched[field.id] && (
                <p className="text-red-600 text-xs mt-1">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        <label className="w-full flex items-center mt-6 cursor-pointer">
          <input
            type="checkbox"
            checked={check}
            className="w-4 h-4 mr-2 accent-teal-600"
            onChange={() => setCheck(!check)}
          />
          <span className="text-sm">
            I agree to the blockvote{" "}
            <span className="font-semibold underline underline-offset-2">
              terms and conditions
            </span>
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="text-red-600 text-sm mt-5 text-center border border-red-300 bg-red-50 px-3 py-2"
          >
            {error}
          </p>
        )}

        <button
          disabled={isSubmitting || check === false}
          type="submit"
          className="btn-primary w-full h-12 mt-7 text-base"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
          {!isSubmitting && <HiArrowNarrowRight />}
        </button>
      </form>
    </div>
  );
};

export default Signup;
