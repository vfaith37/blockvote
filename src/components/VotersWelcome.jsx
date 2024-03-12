import React, { useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import LOGO from "../assets/logo.png";
import { Data } from "../data/dummydata";

export function VotersWelcome() {
  const navigate = useNavigate();
  return (
    <div className="mt-[220px] flex flex-col items-center">
      <p className="font-bold text-[77px]">Welcome James</p>
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
      <p className="font-bold text-[77px]">BUCC GENERAL ELECTIONS</p>
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
  const [selectedCandidates, setSelectedCandidates] = useState({});
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
    navigate("/voterselect", { state: selectedCandidates });
  };
  const handleCandidateSelect = (candidate) => {
    const updatedCandidates = { ...selectedCandidates };
    updatedCandidates[currentSection.title] = candidate;
    setSelectedCandidates(updatedCandidates);
    console.log(updatedCandidates);
  };

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="mt-4 flex flex-col items-center">
      {currentSection && (
        <>
          <p className="font-bold text-[77px]">{currentSection.title}</p>
          <Carousel
            data={currentSection.data}
            onSelect={handleCandidateSelect}
          />
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
                className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center text-base font-bold text-white"
              >
                Next <HiArrowNarrowRight />
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center text-base font-bold text-white"
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

export function VoterSelect() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCandidates = location.state;

  const selectedCandidatesObject = [];

  for (const key in selectedCandidates) {
    if (selectedCandidates.hasOwnProperty(key)) {
      selectedCandidatesObject.push(selectedCandidates[key]);
    }
  }

  console.log(selectedCandidatesObject);
  // const next = () => {
  //   navigate("/votingend");
  // };
  return (
    <div className="flex flex-col pt-28 items-center w-screen h-screen overflow-hidden dark:text-white dark:bg-black bg-cover bg-center">
      <div className="flex items-center gap-3">
        <img src={LOGO} alt="blockvote" className="h-4" />
        <h1 className="text-xl font-bold">blockvote</h1>
      </div>
      {/* <p className="text-teal-600 text-[326px] font-black font-['Outfit']">
        Voted
      </p>
      <p className="text-neutral-400 text-2xl font-normal font-['Outfit'] tracking-wide">
        Your ballot has been casted
      </p>
      <button
        className="w-40 h-14 px-6 py-4 bg-teal-600 justify-center items-center mt-[111px] text-white"
        onClick={goHome}
      >
        Back to Home
      </button> */}
      <table className="table-auto mt-[43px]">
        {selectedCandidatesObject.map((item) => {
          return (
            <tbody>
              <tr>
                <td className="border-none px-14 py-2 text-neutral-500 text-3xl font-semibold font-['Outfit'] tracking-wide truncate">{item.position}</td>
                <td className="border-none px-4 py-2 opacity-50 text-neutral-500 text-3xl font-semibold font-['Outfit'] tracking-wide truncate">
                  {item.firstname.charAt(0).toUpperCase() +
                    item.firstname.slice(1)}{" "}
                  {item.lastname.charAt(0).toUpperCase() +
                    item.lastname.slice(1)}
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
      <button
        className="w-40 h-14 px-6 py-4 bg-teal-600 justify-center items-center mt-[111px] text-white flex gap-2"
        onClick={()=>navigate("/votingend")}
      >
        Cast ballot <HiArrowNarrowRight />
      </button>
    </div>
  );
}

export function VotingEnd() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen overflow-hidden dark:text-white bg-[url('./assets/bge.png')] dark:bg-black bg-cover bg-center">
      <div className="flex">
        <img src={LOGO} alt="blockvote" className="h-4 mr-2 mt-2" />
        <h1 className="text-xl font-bold mr-auto">blockvote</h1>
      </div>
      <p className="text-teal-600 text-[326px] font-black font-['Outfit']">
        Voted
      </p>
      <p className="text-neutral-400 text-2xl font-normal font-['Outfit'] tracking-wide">
        Your ballot has been casted
      </p>
      <button
        className="w-40 h-14 px-6 py-4 bg-teal-600 justify-center items-center mt-[111px] text-white"
        onClick={goHome}
      >
        Back to Home
      </button>
    </div>
  );
}
