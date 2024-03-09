import React from "react";
import { format } from "date-fns";
import { HiOutlineSave } from "react-icons/hi";
import { ELECTION_DATA } from "../data/dummydata";
import classNames from "classnames";
import BarChart from "./Chart";

export default function Overview() {
  const today = new Date();
  const formattedDate = format(today, "EEE dd MMM, yyy");
  return (
    <div className="text-white">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm text-neutral-500 tracking-tight font-normal">
            {formattedDate}
          </p>
          <h1 className="text-3xl font-medium tracking-tight">Overview</h1>
        </div>
        <div className="gap-2 flex w-28 h-10 justify-center bg-teal-600 rounded items-center">
          <p className="items-center justify-center font-medium text-base">
            Export
          </p>
          <HiOutlineSave fontSize={18} />
        </div>
      </div>

      <div className="my-10 border border-white rounded-xl p-6">
        <BarChart />
      </div>

      <div className="grid grid-cols-2 gap-7">
        <div className="rounded-lg bg-neutral-600 px-10 py-10">
          <p className="text-white text-xl font-bold">Votes</p>
        </div>
        <div className="grid grid-rows-2 gap-7">
          <div className="rounded-lg bg-neutral-600 px-10 py-10">
            <p className="text-white text-xl font-bold">Elections</p>
            {ELECTION_DATA.map((item) => {
              return (
                <div
                  key={item.title}
                  className={classNames(
                    item.status === "Ongoing"
                      ? "bg-green-700"
                      : "bg-red-700" || item.status === "Pending"
                      ? "bg-red-700"
                      : "bg-teal-600",
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
          <div className="rounded-lg bg-neutral-600 px-10 py-10">
            <div className="flex justify-between">
              <p className="text-white text-xl font-bold">
                Candidate Performance
              </p>
              <button className="bg-teal-600 text-sm h-8 w-16 rounded-3xl">
                See all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
