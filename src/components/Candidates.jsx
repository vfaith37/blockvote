import React, { useState } from "react";
// import PROFILE_IMAGE from "../assets/profile.jpg";
import { CANDIDATE_DATA } from "../data/dummydata";
import { HiOutlineSave, HiOutlineTrash } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Modal from "./Modal";

export default function Candidates() {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-white w-full flex-grow relative">
      <div className="w-full h-full my-16 border border-white rounded-lg items-center pl-12 py-7">
        <div className="flex flex-col">
          <button onClick={()=>setOpen(true)} className="flex gap-2 h-8 w-24 bg-green-900 rounded-lg items-center justify-center text-sm font-normal self-end mx-28">
            Add new <HiOutlineSave />
          </button>
          {open === true ? <Modal onClose={()=>setOpen(false)} />:null}
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
                <tbody className="bg-transparent border-0">
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
                        <button class="bg-teal-600 items-center flex justify-center text-gray-50 rounded-lg w-12 h-8 text-xs font-medium gap-1">
                          Edit
                          <FaEdit />
                        </button>
                        <button class="bg-red-600 items-center flex justify-center text-gray-50 rounded-lg w-16 h-8 text-xs font-medium gap-1">
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
        </div>
      </div>
    </div>
  );
}