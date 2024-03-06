import classNames from "classnames";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { otpSchema } from "../schemas";
import client from "../api/client";

const otp =
  "w-16 h-16 flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-[#00A699] uppercase";

const OTP = () => {
  const location = useLocation();
  const { username, password } = location.state;
  const [userInfo, setUserInfo] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const headers = {
    "Content-Type": "application/json",
  };
  const Data = {
    email: username,
    password: password,
  };
  console.log(username);
  console.log(password);

  const onSubmit = async (values, actions) => {
    const otpCode =
      values.otp1 + values.otp2 + values.otp3 + values.otp4 + values.otp5;

    try {
      const res = await client.post("organization/verifyUser", {
        token: otpCode,
      });
      if (res.status === 200 && res.data.success === true) {
        try {
          const res = await client.post("organization/signin", Data, {
            headers: headers
          });
          console.log(res.data);

          if (res.status === 200) {
            let token = res.data.token;
            let refreshToken = res.data.refreshToken;
            let userinfo = res.data.organization;
            setUserInfo(userinfo);
            setUserToken(token);
            if (token != null && userinfo != null) {
              localStorage.setItem("token", JSON.stringify(token));
              localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
              localStorage.setItem("userInfo", JSON.stringify(userinfo));
              navigate("/dashboard", { replace: true });
            }
          }
        } catch (e) {
          console.log(e);
        } finally {
        }
      }
    } catch (error) {}
    
    console.log(actions);
    await new Promise((resolve) => setTimeout(resolve, 1000));
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

  console.log(errors);
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col max-w-[500px] py-[40%]">
      <div className="w-full flex flex-col mb-2">
        <h3 className="text-3xl font-semibold mb-2 font-['Urbanist']">
          OTP verification🔒
        </h3>
        <p className="text-sm text-black text-opacity-50 font-normal">
          An email has been sent to you containing a one time password
        </p>

        <p className="text-center text-teal-600 text-lg font-semibold font-['Urbanist'] py-4">
          05:23
        </p>
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="w-full flex flex-col">
          <div className="flex flex-row items-center justify-between mx-auto w-full gap-2">
            <input
              type="text"
              id="otp1"
              className={classNames(
                otp,
                errors.otp1 && touched.otp1 && "border border-red-600"
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.otp1}
              maxLength={1}
            ></input>
            <input
              type="text"
              id="otp2"
              className={classNames(
                otp,
                errors.otp2 && touched.otp2 && "border border-red-600"
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.otp2}
              maxLength={1}
            ></input>
            <input
              type="text"
              id="otp3"
              className={classNames(
                otp,
                errors.otp3 && touched.otp3 && "border border-red-600"
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.otp3}
              maxLength={1}
            ></input>
            <input
              type="text"
              id="otp4"
              className={classNames(
                otp,
                errors.otp4 && touched.otp4 && "border border-red-600"
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.otp4}
              maxLength={1}
            >
              {console.log(values.otp4)}
            </input>
            <input
              type="text"
              id="otp5"
              className={classNames(
                otp,
                errors.otp5 && touched.otp5 && "border border-red-600"
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.otp5}
              maxLength={1}
            ></input>
          </div>

          <button
            // onClick={() => navigate("/dashboard")}
            type="text"
            className="w-full mt-8 text-white bg-[#00A699] font-semibold  rounded-md p-2 text-center flex items-center justify-center"
          >
            Continue
          </button>

          <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500 mt-6">
            <p>
              Didn't recieve code?
              <span className="text-blue-600"> Resend</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OTP;
