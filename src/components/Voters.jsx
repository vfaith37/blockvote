import React, { useEffect, useRef, useState } from "react";
import { CANDIDATE_DATA } from "../data/dummydata";
import { HiOutlineCheck, HiOutlineSave, HiOutlineTrash } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Modal from "./Modal";
import Papa from "papaparse";
import { voterSchema } from "../schemas";
import { useFormik } from "formik";
import classNames from "classnames";
import client from "../api/client";

const inputStyles =
  "w-[350px] h-11 text-white py-2 my-2 bg-transparent rounded-md border border-white pl-2";

export default function Voters() {
  const [open, setOpen] = useState(false);
  const csv = useRef(null);
  const [loading, setLoading] = useState(false);
  const [voterData, setVoterData] = useState([]);
  const [voterToDelete, setVoterToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileRef = useRef(null);
  const electionId = localStorage.getItem("electionId");
  const refreshToken = localStorage.getItem("refreshToken");
  const myHeaders = {
    "Content-Type": "application/json",
  };

  const requestOptions = {
    headers: myHeaders,
  };

  const onSubmit = async (values, actions) => {
    console.log(values);
    const myHeader = {
      Cookie: `refreshToken=${refreshToken}`,
      "Content-Type": "multipart/form-data", // Set Content-Type for FormData
    };

    const axiosConfig = {
      headers: myHeader,
    };
    // try {
    //   const formData = new FormData();
    //   formData.append("firstname", values.firstname);
    //   formData.append("lastname", values.lastname);
    //   formData.append("email", values.email);

    //   const response = await client.post(
    //     `/voter/addNewVoter/${electionId}`,
    //     formData,
    //     axiosConfig
    //   );
    //   if (response.status === 200) {
    //     try {
    //       const res = await client.get(
    //         `voter/getAllVoters/${electionId}`,
    //         requestOptions
    //       );
    //       if (res.status === 200) {
    //         setVoterData(res.data.data);
    //       }
    //     } catch (error) {}
    //   }
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   onClose();
    // }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

//   useEffect(() => {
//     const getAllElections = async () => {
//       try {
//         const res = await client.get(
//           `voter/getAllVoters/${electionId}`,
//           requestOptions
//         );
//         if (res.status === 200) {
//           setVoterData(res.data.data);
//         }
//       } catch (error) {}
//     };
//     getAllElections();
//   }, []);

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
      email: "",
    },
    validationSchema: voterSchema,
    onSubmit,
    enableReinitialize: true,
  });
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setLoading(true);
    Papa.parse(file, {
      complete: (result) => {
        const csvData = result.data;
        if (csvData && csvData.length > 1) {
          const headers = csvData[0];
          const data = csvData.slice(1);
          const jsonData = data.map((row) => {
            return headers.reduce((obj, header, index) => {
              obj[header] = row[index];
              return obj;
            }, {});
          });
          const transformedObject = {
            voterArray: jsonData,
          };
          console.log(transformedObject);
          // Post JSON data using Axios
          const postVoter = async () => {
            try {
              const response = await client.post(
                `/voter/uploadVoters/${electionId}`,
                transformedObject
              );
              console.log("Post successful:", response.data);

              if (response.status === 200) {
                try {
                  const res = await client.get(
                    `voter/getAllVoters/${electionId}`,
                    requestOptions
                  );
                  if (res.status === 200) {
                    setVoterData(res.data.data);
                  }
                } catch (error) {
                  console.error("Error fetching voters:", error);
                }
              }
            } catch (error) {
              console.error("Post error:", error);
            } finally {
              setLoading(false);
            }
          };
          postVoter();
        }
      },
    });
  };

  const handleDeleteVoter = (id) => {
    setVoterToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await client.delete(
        `/voter/deleteVoter/${voterToDelete}/${electionId}`,
        requestOptions
      );
      if (response.status === 200) {
        // Update voter data after deletion
        const updatedVoters = voterData.filter(
          (voter) => voter._id !== voterToDelete
        );
        setVoterData(updatedVoters);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setShowConfirmation(false);
    }
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
              disabled={loading}
              className="flex gap-2 h-8 w-32 bg-green-900 rounded-lg items-center justify-center text-sm font-normal"
            >
              {loading === true ? (
                "loading"
              ) : (
                <>
                  Upload CSV <HiOutlineSave />
                </>
              )}
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
                  Add New Voter
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
                      <p className="text-xs font-normal">E-mail</p>
                      {errors.email && touched.email && (
                        <p className="error text-red-600">{errors.email}</p>
                      )}
                    </div>
                    <input
                      id="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      type="text"
                      className={classNames(
                        inputStyles,
                        errors.email && touched.email ? "input-error" : ""
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
                  email
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Action
                </th>
              </tr>
            </thead>
            {voterData.map((item) => {
              return (
                <tbody key={item.id} className="bg-transparent border-0">
                  <tr>
                    <td className="border-0 items-center align-middle text-white text-sm font-medium">
                      {item._id}
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
                      {item.email}
                    </td>
                    <td className="border-0 px-6 align-middle">
                      <div className="flex gap-3">
                        <button className="bg-teal-600 items-center flex justify-center text-gray-50 rounded-lg w-12 h-8 text-xs font-medium gap-1">
                          Edit
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteVoter(item._id)}
                          className="bg-red-600 items-center flex justify-center text-gray-50 rounded-lg w-16 h-8 text-xs font-medium gap-1"
                        >
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
          {showConfirmation && (
            <Modal>
              <div className="w-full flex flex-col justify-center items-center">
                <div className="mt-10 text-3xl font-bold">Delete</div>
                <p className="text-xl mt-4 font-normal">
                  Are you sure you want to delete?
                </p>
                <p className="text-sm mt-4 font-normal text-neutral-500">
                  All election data will be lost.
                </p>
                <div className="flex justify-between my-4 gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="bg-gray-600 text-white rounded-lg px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white rounded-lg px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Modal>
          )}
          <button className="flex gap-2 h-8 w-24 bg-green-900 rounded-lg items-center justify-center text-sm font-normal self-end mx-28 my-10">
            Done
            <HiOutlineCheck size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
