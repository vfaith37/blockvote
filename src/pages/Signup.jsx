import React, { useState } from "react";
import GOOGLE_ICON from "../assets/google-icon.svg";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import classNames from "classnames";
import client from "../api/client";

const inputStyles =
  "w-full h-11 text-black py-2 my-2 bg-transparent rounded-md border border-black/40 pl-2";
const checked = "w-[15px] h-[15px] mr-2";

const Signup = () => {
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    console.log(values);
    try {
      const res = await client.post("organization/signup", {
        ...values,
      });

      console.log(res);
      if (res.data.success && res.status === 200) {
        console.log(res.data);
        navigate("/organization/otp", {
          replace: true,
          state: { username: values.email, password: values.password },
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
    console.log(actions);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
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

  console.log(errors);
  return (
    <div className="w-full flex flex-col max-w-[500px] py-[20%]">
      <div className="w-full flex flex-col mb-2">
        <h3 className="text-3xl font-semibold mb-2">Create your Account 👋</h3>
        <p className="text-sm text-black text-opacity-50  font-normal">
          Let's enter your data to continue to use blockvote
        </p>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="w-full flex flex-col pt-2">
          <div className="flex justify-between text-[13px]">
            <p className="text-black  font-semibold">First Name</p>
            {errors.firstname && touched.firstname && (
              <p className="error text-red-600">{errors.firstname}</p>
            )}
          </div>
          <input
            type="text"
            id="firstname"
            className={classNames(
              inputStyles,
              errors.firstname && touched.firstname ? "input-error" : ""
            )}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.firstname}
          />
          <div className="flex justify-between text-[13px]">
            <p className="text-black  font-semibold">Last Name</p>
            {errors.lastname && touched.lastname && (
              <p className="error text-red-600">{errors.lastname}</p>
            )}
          </div>
          <input
            id="lastname"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.lastname}
            type="text"
            className={classNames(
              inputStyles,
              errors.lastname && touched.lastname ? "input-error" : ""
            )}
          />
          <div className="flex justify-between text-[13px]">
            <p className="text-black  font-semibold">Organization</p>
            {errors.name && touched.name && (
              <p className="error text-red-600">{errors.name}</p>
            )}
          </div>
          <input
            id="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            type="text"
            className={classNames(
              inputStyles,
              errors.name && touched.name ? "input-error" : ""
            )}
          />
          <div className="flex justify-between text-[13px]">
            <p className="text-black  font-semibold">Email</p>
            {errors.email && touched.email && (
              <p className="error text-red-600">{errors.email}</p>
            )}
          </div>
          <input
            value={values.email}
            onChange={handleChange}
            id="email"
            type="email"
            className={classNames(
              inputStyles,
              errors.email && touched.email ? "input-error" : ""
            )}
          />
          <div className="flex justify-between text-[13px]">
            <p className="text-black  font-semibold">Password</p>
            {errors.password && touched.password && (
              <p className="error text-red-600">{errors.password}</p>
            )}
          </div>
          <input
            id="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={classNames(
              inputStyles,
              errors.password && touched.password ? "input-error" : ""
            )}
          />
          <div className="flex justify-between text-[13px]">
            <p className="text-black  font-semibold">Confirm password</p>
            {errors.confirmpassword && touched.confirmpassword && (
              <p className="error text-red-600">{errors.password}</p>
            )}
          </div>
          <input
            id="confirmpassword"
            type="password"
            value={values.confirmpassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={classNames(
              inputStyles,
              errors.confirmpassword && touched.confirmpassword
                ? "input-error"
                : ""
            )}
          />
        </div>

        <div className="w-full items-center pt-2">
          <div className="w-full flex items-center">
            <input
              type="checkbox"
              checked={check}
              className={classNames(
                checked,
                errors.acceptedTos && touched.acceptedTos
              )}
              onClick={() => setCheck(!check)}
            />
            <p className="text-[12px] ">
              By signing up to patty you agree all{" "}
              <span className="text-black font-semibold text-opacity-50 underline">
                terms and conditions
              </span>
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col my-2">
          <button
            disabled={isSubmitting || check === false}
            type="submit"
            className="w-full my-2 text-white bg-[#00A699] font-semibold  rounded-md p-2 text-center flex items-center justify-center"
          >
            Sign up
          </button>
        </div>
      </form>

      <div className="w-full flex items-center justify-center relative py-2">
        <div className="w-full h-[1px] bg-black"></div>
        <div className="w-[45px] text-[#F5F5F5] absolute bg-[#F5F5F5]">
          <p className="text-sm w-[45px] text-black/80 ml-3"> OR</p>
        </div>
      </div>
      <div className="w-full my-4 text-[#060606] bg-transparent border border-black/40 font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer">
        <img src={GOOGLE_ICON} alt="metamask" className="h-5 mr-2" />
        Continue with Google
      </div>
    </div>
  );
};

export default Signup;
