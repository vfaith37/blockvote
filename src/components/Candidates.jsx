import React, { useRef, useState } from "react";
import { CANDIDATE_DATA } from "../data/dummydata";
import { HiOutlineCheck, HiOutlineSave, HiOutlineTrash } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Modal from "./Modal";
import Papa from "papaparse";
import { candidateSchema } from "../schemas";
import { useFormik } from "formik";
import classNames from "classnames";
import PreviewImage from "./PreviewImage";

const inputStyles =
  "w-[350px] h-11 text-white py-2 my-2 bg-transparent rounded-md border border-white pl-2";

export default function Candidates() {
  const [open, setOpen] = useState(false);
  const csv = useRef(null);

  const [base64Image, setBase64Image] = useState("");
  const fileRef = useRef(null);
  const onSubmit = async (values, actions) => {
    try {
      const file = values.photo;
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64Image(reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      }

      const data = {
        firstname: values.firstname,
        lastname: values.lastname,
        position: values.position,
        photo: base64Image,
      };
      console.log(1, data);
    } catch (error) {
    } finally {
      onClose();
    }

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
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     setFieldValue("photo", reader.result);
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (result) => {
        // let data = result.data
        const headers = result.data[0];
        const data = result.data.slice(1);
        const jsonData = data.map((row) => {
          return headers.reduce((obj, header, index) => {
            obj[header] = row[index];
            return obj;
          }, {});
        });
        console.log(jsonData);
      },
    });
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className="text-white w-full flex-grow relative">
      <div className="w-full h-full my-16 border border-white rounded-lg items-center pl-12 py-7">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <input
              ref={csv}
              hidden
              className=""
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => {
                csv.current.click();
              }}
              className="flex gap-2 h-8 w-32 bg-green-900 rounded-lg items-center justify-center text-sm font-normal"
            >
              Upload CSV <HiOutlineSave />
            </button>

            <button
              onClick={() => setOpen(true)}
              className="flex gap-2 h-8 w-24 bg-green-900 rounded-lg items-center justify-center text-sm font-normal self-end mx-28"
            >
              Add new <HiOutlineSave />
            </button>
          </div>
          {open === true ? (
            <Modal>
              <div className="w-full flex flex-col justify-center items-center">
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
                        errors.firstname && touched.firstname
                          ? "input-error"
                          : ""
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
                        className="bg-teal-600 items-center flex justify-center text-gray-50 rounded-lg w-14 h-8 text-xs font-medium gap-1"
                      >
                        Save
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </Modal>
          ) : null}
          <table className="table-fixed w-full h-full hover:text-gray-100">
            <thead className="bg-transparent">
              <tr>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  ID
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Photo
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  First Name
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Last Name
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Position
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Action
                </th>
              </tr>
            </thead>
            {CANDIDATE_DATA.map((item) => {
              return (
                <tbody key={item.id} className="bg-transparent border-0">
                  <tr>
                    <td className="border-0 items-center align-middle text-white text-sm font-medium">
                      {item.id}
                    </td>
                    <td className="border-0 px-6 align-middle">
                      <img
                        className="rounded-full h-12 w-12  object-cover"
                        src={item.image}
                        alt="unsplash"
                      />
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                      {item.firstname}
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                      {item.lastname}
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                      {item.position}
                    </td>
                    <td className="border-0 px-6 align-middle">
                      <div className="flex gap-3">
                        <button className="bg-teal-600 items-center flex justify-center text-gray-50 rounded-lg w-12 h-8 text-xs font-medium gap-1">
                          Edit
                          <FaEdit />
                        </button>
                        <button className="bg-red-600 items-center flex justify-center text-gray-50 rounded-lg w-16 h-8 text-xs font-medium gap-1">
                          Delete
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <button className="flex gap-2 h-8 w-24 bg-green-900 rounded-lg items-center justify-center text-sm font-normal self-end mx-28 my-10">
            Done
            <HiOutlineCheck size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
