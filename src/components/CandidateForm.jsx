// CandidateForm.js
import React, { useRef } from "react";
import { useFormik } from "formik";
import { candidateSchema } from "../schemas";
import classNames from "classnames";
import PreviewImage from "./PreviewImage";
import { HiOutlineTrash } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";

const inputStyles =
  "w-[350px] h-11 text-white py-2 my-2 bg-transparent rounded-md border border-white pl-2";

const CandidateForm = ({ onSubmit, onClose, initialValues }) => {
  const fileRef = useRef(null);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: candidateSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="mt-10 mb-4 text-base font-bold">Add new candidate</div>
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
            <PreviewImage
              file={values.photo}
              classnames={"w-[100px] h-[100px]"}
            />
          )}

          <div className="flex justify-between text-[13px]">
            <button
              onClick={() => {
                fileRef.current.click();
              }}
              type="button"
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
              type="button"
              onClick={onClose}
              className="bg-red-600 items-center flex justify-center text-gray-50 rounded-lg w-16 h-8 text-xs font-medium gap-1"
            >
              Delete
              <HiOutlineTrash />
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              //   onClick={() => console.log(232)}
              className="bg-teal-600 items-center flex justify-center text-gray-50 rounded-lg w-14 h-8 text-xs font-medium gap-1"
            >
              Save
              <FaEdit />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
