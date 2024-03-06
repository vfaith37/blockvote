import React, { useRef, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { useFormik } from "formik";
import { candidateSchema } from "../schemas";
import classNames from "classnames";
import client from "../api/client";
import { FaEdit } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import PreviewImage from "./PreviewImage";

const inputStyles =
  "w-[350px] h-11 text-white py-2 my-2 bg-transparent rounded-md border border-white pl-2";

const Modal = (props) => {
  // const navigate = useNavigation();
  const { onClose } = props;
  const fileRef = useRef(null);
  // const [fieldValue, setFieldValue] = useState();
  const onSubmit = async (values, actions) => {
    // navigate("/dashboard");

    console.log(1, values);
    console.log(actions);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      position: "",
      photo: null,
    },
    validationSchema: candidateSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <div class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
      <div class="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-neutral-800">
        <div class="w-full flex flex-col justify-center items-center">
          <div className="mt-10 mb-4 text-base font-bold">
            Add new candidate
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="w-full flex flex-col pt-2">
              <div className="flex justify-between text-[13px]">
                <p className="text-xs font-normal">First Name</p>
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
                <p className="text-xs font-normal">Last Name</p>
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
                <p className="text-xs font-normal">Position</p>
                {errors.position && touched.position && (
                  <p className="error text-red-600">{errors.position}</p>
                )}
              </div>
              <input
                id="position"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.position}
                type="text"
                className={classNames(
                  inputStyles,
                  errors.position && touched.position ? "input-error" : ""
                )}
              />
              {values.photo && (
                <PreviewImage file={values.photo} classnames={"w-[100px] h-[100px]"} />
              )}

              <div className="flex justify-between text-[13px]">
                <button
                  onClick={() => {
                    fileRef.current.click();
                  }}
                  className="text-xs font-normal rounded-lg h-8 w-24 bg-teal-600 my-3"
                >
                  Upload Photo
                </button>
                {errors.image && touched.image && (
                  <p className="error text-red-600">{errors.image}</p>
                )}
              </div>
              <input
                hidden
                ref={fileRef}
                id="photo"
                name="photo"
                type="file"
                onChange={(event) => {
                  setFieldValue("photo", event.target.files[0]);
                }}
                // onBlur={handleBlur}
                className={classNames(
                  inputStyles,
                  errors.photo && touched.photo ? "input-error" : ""
                )}
              />
            </div>

            <div className="w-full flex flex-col my-2">
              <div className="flex justify-between mx-[100px]">
                <button
                  onClick={onClose}
                  className="bg-red-600 items-center flex justify-center text-gray-50 rounded-lg w-16 h-8 text-xs font-medium gap-1"
                >
                  Delete
                  <HiOutlineTrash />
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-teal-600 items-center flex justify-center text-gray-50 rounded-lg w-14 h-8 text-xs font-medium gap-1"
                >
                  Save
                  <FaEdit />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Modal;

{
  /* <div class="m-8 my-20 max-w-[400px] mx-auto">
            <div class="mb-8">
              <h1 class="mb-4 text-3xl font-extrabold">
                Add new Candidate
              </h1>
              <p class="text-gray-600">
                Get the most out of Twitter by staying up to date with what's
                happening.
              </p>
            </div>
            <div class="space-y-4">
              <button class="p-3 bg-black rounded-full text-white w-full font-semibold">
                Allow notifications
              </button>
              <button onClick={onClose} class="p-3 bg-white border rounded-full w-full font-semibold">
                Skip for now
              </button>
            </div>
          </div> */
}
