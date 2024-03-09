import React, { useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import LOGO from "../assets/logo.png";
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
    navigate("/votingend");
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
export function VotingEnd() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/")
}
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen overflow-hidden text-white bg-[url('./assets/bge.png')] bg-black bg-cover bg-center">
    <div className="flex">
      <img src={LOGO} alt="blockvote" className="h-4 mr-2 mt-2" />
      <h1 className="text-xl font-bold mr-auto">blockvote</h1>
    </div>
      <p className="text-teal-600 text-[326px] font-black font-['Outfit']">Voted</p>
      <p className="text-neutral-400 text-2xl font-normal font-['Outfit'] tracking-wide">Your ballot has been casted</p>
      <button className="w-40 h-14 px-6 py-4 bg-teal-600 justify-center items-center mt-[111px]" onClick={goHome}>Back to Home</button>
  </div>
  );
}