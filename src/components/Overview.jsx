import React from "react";
import { format } from "date-fns";
import { HiOutlineSave } from "react-icons/hi";
import { CANDIDATE_DATA, ELECTION_DATA } from "../data/dummydata";
import classNames from "classnames";
import BarChart from "./Chart";
import { generatePDF } from "./PDFGenerator";

export default function Overview() {
  const today = new Date();
  const formattedDate = format(today, "EEE dd MMM, yyy");
  return (
    <div className="text-white" id="pdf-content">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm text-neutral-500 tracking-tight font-normal">
            {formattedDate}
          </p>
          <h1 className="text-3xl font-medium tracking-tight">Overview</h1>
        </div>
        <button onClick={generatePDF} className="font-medium text-base gap-2 flex w-28 h-10 justify-center bg-teal-600 rounded items-center">
          Export
          <HiOutlineSave fontSize={18} />
        </button>
      </div>

      <div className="my-10 border border-white rounded-xl p-6">
        <BarChart />
      </div>

      <div className="grid grid-cols-2 gap-7">
        <div className="rounded-lg bg-[#151515] px-10 py-10">
          <p className="text-white text-xl font-bold">Votes</p>
          <table className="table-fixed w-full h-full hover:text-gray-100">
            <thead className="bg-transparent">
              <tr>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  ID
                </th>
                <th className="border-0  px-6 text-stone-600 text-base font-medium">
                  Name
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Time
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Date
                </th>
                <th className="border-0 px-6 text-stone-600 text-base font-medium">
                  Process
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
                    <td className="border-0  px-6 align-middle text-white text-sm font-medium">
                      {item.firstname} {item.lastname}
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                      {item.position}
                    </td>
                    <td className="border-0 px-6 align-middle text-white text-sm font-medium"></td>
                    <td className="border-0 px-6 align-middle">
                      <div className="bg-transparent border-red-600 border items-center flex justify-center text-red-600 rounded-lg w-16 h-8 text-xs font-medium gap-1">
                        Voted
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
        <div className="grid grid-rows-2 gap-7">
          <div className="rounded-lg bg-[#151515] px-10 py-10">
            <p className="text-white text-xl font-bold">Elections</p>
            {ELECTION_DATA.map((item) => {
              return (
                <div
                  key={item.title}
                  className={classNames(
                    item.status === "Ongoing"
                      ? "bg-green-700"
                      :  item.status === "Pending"
                      ? "bg-teal-600"
                      : "bg-red-700",
                    "w-[95%] h-20 px-5 py-3 my-4 rounded-lg justify-between flex items-center"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-bold">{item.title}</p>
                    <p className="text-xs font-light">{item.type}</p>
                  </div>
                  <p>{item.status}</p>
                </div>
              );
            })}
          </div>
          <div className="rounded-lg bg-[#151515] px-10 py-10">
            <div className="flex justify-between">
              <p className="text-white text-xl font-bold">
                Candidate Performance
              </p>
              <button className="bg-teal-600 text-sm h-8 w-16 rounded-3xl">
                See all
              </button>
            </div>
            <table className="table-fixed w-full h-full hover:text-gray-100">
              <thead className="bg-transparent">
                <tr>
                  <th className="border-0 px-6 text-stone-600 text-base font-medium">
                    Name
                  </th>
                  <th className="border-0 px-6 text-stone-600 text-base font-medium">
                    Position
                  </th>
                  <th className="border-0 px-6 text-stone-600 text-base font-medium">
                    Vote
                  </th>
                </tr>
              </thead>
              {CANDIDATE_DATA.map((item) => {
                return (
                  <tbody key={item.id} className="bg-transparent border-0">
                    <tr>
                      <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                        {item.lastname} {item.firstname}
                      </td>
                      <td className="border-0 px-6 align-middle text-white text-sm font-medium">
                        {item.position}
                      </td>
                      <td className="border-0 items-center align-middle text-white text-sm font-medium">
                        {item.id}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
