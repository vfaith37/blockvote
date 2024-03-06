import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import { Data } from "../data/dummydata";

export function VotersWelcome() {
  const navigate = useNavigate();
  return (
    <div className="mt-[220px] flex flex-col items-center">
      <p className="text-white font-bold text-[77px]">Welcome James</p>
      <p className="text-neutral-500 text-[35px] font-normal">
        Let's walk you through the voting process
      </p>
      <button
        onClick={() => navigate("info")}
        className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center mt-[220px] text-base font-bold"
      >
        Next <HiArrowNarrowRight />
      </button>
    </div>
  );
}

export function ElectionInfo() {
  const navigate = useNavigate();
  return (
    <div className="mt-[220px] flex flex-col items-center">
      <p className="text-white font-bold text-[77px]">BUCC GENERAL ELECTIONS</p>
      <p className="text-neutral-500 text-[35px] font-normal">
        Time to choose your preferred candidate
      </p>
      <button
        onClick={() => {
          navigate("/voters/vote");
        }}
        className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center mt-[220px] text-base font-bold"
      >
        Next <HiArrowNarrowRight />
      </button>
    </div>
  );
}

export function Vote() {
    
  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="text-white font-bold text-[77px]">President</p>
      <Carousel data={Data} />
      <p className="text-neutral-500 text-[28px] font-normal">
        choose your preferred candidate
      </p>
      <button className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center mt-[120px] text-base font-bold">
        Next <HiArrowNarrowRight />
      </button>
    </div>
  );
}
