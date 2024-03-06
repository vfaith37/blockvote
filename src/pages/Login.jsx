import React, { useEffect, useState } from "react";
import METAMASK_ICON from "../assets/metamask-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signInSchema } from "../schemas";
import classNames from "classnames";
import client from "../api/client";

const inputStyles =
  "w-full h-11 text-black py-2 my-2 bg-transparent rounded-md border border-black/40 pl-2";
const Login = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userAuth, setUserAuth] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (values, actions) => {
    setUserAuth(true);
    try {
      const res = await client.post("organization/signin", {
        ...values,
      });

      if (res.data.organization.isVerified === true && res.status === 200) {
        let token = res.data.token;
        let refreshToken = res.data.refreshToken;
        let userinfo = res.data.organization;
        setUserInfo(userinfo);
        setUserToken(token);
        if (token != null && userinfo != null) {
          let auth = true
          localStorage.setItem("isAuthenticated", auth)
          localStorage.setItem("rememberMe", rememberMe);
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("userInfo", JSON.stringify(userinfo));
          localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
          navigate("/dashboard", { replace: true, });
        }
      } else if (
        res.data.organization.isVerified === false &&
        res.status === 200
      ) {
        let userinfo = res.data.organization;
        setUserInfo(userinfo);
        localStorage.setItem("userInfo", JSON.stringify(userinfo));
        navigate("/organization/otp", { replace: true });
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
    // console.log(actions);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // actions.resetForm();
  };

  useEffect(() => {
    const rem = localStorage.getItem("rememberMe");
    if (rem === "true") {
      console.log(rem);
      navigate("/dashboard", { replace: true });
    }
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

  console.log(errors);
  return (
    <div className="w-full flex flex-col max-w-[500px] py-[20%]">
      <div className="w-full flex flex-col mb-2">
        <h3 className="text-3xl font-semibold mb-4">Welcome to blockvote 👋</h3>

        <div className="w-full py-4 my-2 text-[#060606] bg-transparent border border-black/40 font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer">
          Continue with Metamask
          <img src={METAMASK_ICON} alt="metamask" className="h-4 ml-2" />
        </div>

        <div className="w-full flex items-center justify-center relative py-[7%]">
          <div className="w-full h-[1px] bg-black"></div>
          <div className="w-[45px] text-[#F5F5F5] absolute bg-[#F5F5F5]">
            <p className="text-sm w-[45px] text-black/80 ml-3"> OR</p>
          </div>
        </div>
        <p className="text-base font-normal text-[#060606] mb-2">
          Don't have an account?
          <Link to="signup">
            <span className="text-[#00A699] cursor-pointer"> Sign up</span>
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="w-full flex flex-col">
          <div className="flex justify-between text-[17px]">
            <p className="text-black  font-semibold">Email</p>
            {/* {errors.password && touched.password && (
              <p className="error text-red-600">{errors.password}</p>
            )} */}
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

          <div className="flex justify-between text-[17px]">
            <p className="text-black  font-semibold">Password</p>
            {/* {errors.password && touched.password && (
              <p className="error text-red-600">{errors.password}</p>
            )} */}
          </div>
          <input
            id="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            className={classNames(
              inputStyles,
              errors.password && touched.password ? "input-error" : ""
            )}
          />
        </div>

        <div className="w-full flex items-center justify-between mt-4">
          <div className="w-full flex items-center">
            <input
              checked={rememberMe}
              onClick={() => setRememberMe(!rememberMe)}
              type="checkbox"
              className={`w-4 h-4 mr-2 ${
                rememberMe === true && "bg-teal-600 text-teal-600"
              }`}
            />
            <p className="text-sm">Remember Me</p>
          </div>
          <Link to="forgotpassword">
            <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2">
              Forgot Password?
            </p>
          </Link>
        </div>

        <div className="w-full flex flex-col my-4">
          {/* <Link to={"dashboard"}> */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full my-2 text-white bg-[#00A699] font-semibold  rounded-md p-2 text-center flex items-center justify-center"
          >
            Sign in
          </button>
          {/* </Link> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
