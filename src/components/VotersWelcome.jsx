import React, { useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
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
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const navigate = useNavigate();

  const groupCandidates = () => {
    const groupedCandidates = Data.reduce((acc, candidate) => {
      const { position } = candidate;
      if (acc[position]) {
        acc[position].push(candidate);
      } else {
        acc[position] = [candidate];
      }
      return acc;
    }, {});

    const sections = Object.entries(groupedCandidates).map(
      ([position, candidates]) => ({
        title: position,
        data: candidates,
      })
    );
    setSections(sections);
  };

  useEffect(() => {
    groupCandidates();
  }, []);

  const handleNext = () => {
    setCurrentSectionIndex((prevIndex) => prevIndex + 1);
  };
  const handlePrevious = () => {
    setCurrentSectionIndex((prevIndex) => prevIndex - 1);
  };
  const handleContinue = () => {
    navigate("/dashboard");
  };
  const currentSection = sections[currentSectionIndex];

  return (
    <div className="mt-4 flex flex-col items-center">
      {currentSection && (
        <>
          <p className="text-white font-bold text-[77px]">
            {currentSection.title}
          </p>
          <Carousel data={currentSection.data} />
          <p className="text-neutral-500 text-[28px] font-normal">
            Choose your preferred candidate
          </p>
          <div className="flex gap-5 mt-5">
            {currentSectionIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center text-base font-bold"
              >
                <HiArrowNarrowLeft /> Previous
              </button>
            )}
            {currentSectionIndex < sections.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center text-base font-bold"
              >
                Next <HiArrowNarrowRight />
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center text-base font-bold"
              >
                Continue <HiArrowNarrowRight />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
