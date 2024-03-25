import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  HiOutlineDocumentText,
  HiOutlineSave,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiOutlineViewGrid,
} from "react-icons/hi";
import Modal from "./Modal";
import { useFormik } from "formik";
import { electionSchema } from "../schemas";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineClock } from "react-icons/hi";
import client from "../api/client";
import { format } from "date-fns";

const inputStyles =
  "bg-transparent border-b border-white w-[340px] h-10 text-white";

export default function Create() {
  const [open, setOpen] = useState(false);
  const [selectedStartDateTime, setSelectedStartDateTime] = useState(null);
  const [selectedStopDateTime, setSelectedStopDateTime] = useState(null);
  const [electionData, setElectionData] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const orgData = JSON.parse(localStorage.getItem("userInfo"))._id;
  const electionId = localStorage.getItem("electionId");
  const [edit, setEdit] = useState(false);

  const myHeaders = {
    "Content-Type": "application/json",
  };

  const requestOptions = {
    headers: myHeaders,
  };
  const onSubmit = async (values, actions) => {
    if (edit === false) {
      try {
        const res = await client.post(
          `/election/createElection/${orgData}`,
          {
            ...values,
          },
          requestOptions
        );
        if (res.status === 200) {
          try {
            const res = await client.get(
              `/election/getOrganizationElections/${orgData}`,
              requestOptions
            );
            if (res.status === 200) {
              localStorage.setItem(
                "electionData",
                JSON.stringify(res.data.data)
              );
              localStorage.setItem("electionId", res.data.data[0]._id);
            }
          } catch (error) {
          } finally {
            const data = localStorage.getItem("electionData");
            if (data) {
              const parseData = JSON.parse(data);
              setElectionData(parseData);
            }
          }
        }
      } catch (error) {
      } finally {
        onClose();
      }
    } else {
      try {
        const res = await client.put(
          `/election/editElectionById/${electionId}`,
          values,
          requestOptions
        );
        if (res.status === 200) {
          console.log(res.data);
          try {
            const res = await client.get(
              `/election/getOrganizationElections/${orgData}`,
              requestOptions
            );
            if (res.status === 200) {
              localStorage.setItem(
                "electionData",
                JSON.stringify(res.data.data)
              );
              localStorage.setItem("electionId", res.data.data[0]._id);
            }
          } catch (error) {
          } finally {
            const data = localStorage.getItem("electionData");
            if (data) {
              const parseData = JSON.parse(data);
              setElectionData(parseData);
            }
          }
        }
      } catch (error) {
      } finally {
        onClose();
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDateTime(date);
    setFieldValue("from", date);
  };
  const handleStopDateChange = (date) => {
    setSelectedStopDateTime(date);
    setFieldValue("to", date);
  };

  const handleEdit = (election) => {
    setSelectedElection(election);
    setEditMode(true);
    setOpen(true);

    // Set initial form values based on the selected election
    setFieldValue("name", election.name);
    setFieldValue("type", election.type);
    setFieldValue("description", election.description);
    setSelectedStartDateTime(new Date(election.from));
    setSelectedStopDateTime(new Date(election.to));
    setEdit(true);
    // const data = {
    //   data: election.name,
    //   type: election.type,
    //   description: election.description,
    //   from: election.from,
    //   to: election.to,
    // };
    // setEditData(data);
    // console.log(data);
  };

  const handleDelete = (electionId) => {
    setShowConfirmation(true);
    setSelectedElection(electionId);
  };

  const confirmDelete = async () => {
    try {
      const res = await client.delete(
        `election/deleteElectionById/${selectedElection}`,
        requestOptions
      );
      if (res.status === 200) {
        const updatedElections = electionData.filter(
          (election) => election._id !== selectedElection
        );
        setElectionData(updatedElections);
        setSelectedElection(null);
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error("Error deleting election:", error);
    }
  };

  useEffect(() => {
    const getAllElections = async () => {
      try {
        const res = await client.get(
          `/election/getOrganizationElections/${orgData}`,
          requestOptions
        );
        if (res.status === 200) {
          localStorage.setItem("electionData", JSON.stringify(res.data.data));
          localStorage.setItem("electionId", res.data.data[0]._id);
        }
      } catch (error) {
      } finally {
        const data = localStorage.getItem("electionData");
        if (data) {
          const parseData = JSON.parse(data);
          setElectionData(parseData);
        }
      }
    };
    getAllElections();
  }, []);

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
    initialValues: {
      name: "",
      type: "",
      description: "",
      from: "",
      to: "",
    },
    validationSchema: electionSchema,
    onSubmit,
    enableReinitialize: true,
  });
  const onClose = () => {
    setOpen(false);
    setFieldValue("name", "");
    setFieldValue("type", "");
    setFieldValue("description", "");
    setSelectedStartDateTime("");
    setSelectedStopDateTime("");
    setEdit(false);
  };
  return (
    <div className="text-white w-full flex-grow relative">
      <div className="w-full h-full my-16 border border-white rounded-lg items-center pl-12 py-7">
        <div className="flex flex-col">
          <button
            onClick={() => setOpen(true)}
            className="flex gap-2 h-8 w-32 bg-green-900 rounded-lg items-center justify-center text-sm font-normal self-end mx-28"
          >
            Create Election <HiOutlineSave />
          </button>
          {open === true ? (
            <Modal>
              <div className="w-full flex flex-col justify-center items-center">
                <div className="mt-10 mb-4 text-base font-bold">
                  Create New Election
                </div>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="w-full flex flex-col pt-2">
                    <div className="flex text-[13px]">
                      {errors.name && touched.name && (
                        <p className="error text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div className="flex gap-3 h-9 items-center my-5">
                      <HiOutlineViewGrid size={20} />
                      <input
                        type="text"
                        id="name"
                        className={classNames(
                          inputStyles,
                          errors.name && touched.name ? "input-error" : ""
                        )}
                        placeholder="Election Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                      />
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <p className="text-violet-500 text-xs font-semibold font-['Urbanist']">
                        optional
                      </p>
                      {errors.type && touched.type && (
                        <p className="error text-red-600">{errors.type}</p>
                      )}
                    </div>

                    <div className="flex gap-3 h-9 items-center my-5">
                      <HiOutlineUserAdd size={20} />
                      <input
                        id="type"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.type}
                        type="text"
                        placeholder="Election Type"
                        className={classNames(
                          inputStyles,
                          errors.type && touched.type ? "input-error" : ""
                        )}
                      />
                    </div>
                    <div className="flex gap-2 w-[340px] my-5">
                      <div className="flex items-center gap-3">
                        <HiOutlineClock size={20} />
                        <DatePicker
                          selected={selectedStartDateTime}
                          onChange={handleStartDateChange}
                          showTimeSelect
                          placeholderText="From"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="bg-transparent border-b border-white w-[150px] h-10 text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <HiOutlineClock size={20} />
                        <DatePicker
                          selected={selectedStopDateTime}
                          onChange={handleStopDateChange}
                          showTimeSelect
                          placeholderText="To"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="bg-transparent border-b border-white w-[150px] h-10 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      {errors.description && touched.description && (
                        <p className="error text-red-600">
                          {errors.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3 h-9 items-center my-5">
                      <HiOutlineDocumentText size={20} />
                      <input
                        id="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        type="text"
                        placeholder="Description"
                        className={classNames(
                          inputStyles,
                          errors.description && touched.description
                            ? "input-error"
                            : ""
                        )}
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col my-2">
                    <div className="flex justify-between mx-[100px]">
                      <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-600 items-center flex justify-center text-gray-50 rounded-lg w-16 h-8 text-xs font-medium gap-1"
                      >
                        Cancel
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
                  Election Title
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Duration
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Description
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Action
                </th>
              </tr>
            </thead>
            {electionData.map((item) => {
              return (
                <tbody key={item._id} className="bg-transparent border-0">
                  <tr>
                    <td className="border-0 items-center align-middle text-white text-sm font-medium">
                      {item._id}
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                      {item.name}
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                      {format(new Date(item.from), "MMMM dd")}-
                      {format(new Date(item.to), "MMMM dd")}
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                      {item.description}
                    </td>
                    <td className="border-0 px-6 align-middle">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-teal-600 items-center flex justify-center text-gray-50 rounded-lg w-12 h-8 text-xs font-medium gap-1"
                        >
                          Edit
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
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
        </div>
      </div>
    </div>
  );
}
