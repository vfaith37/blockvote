import React, { useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import Carousel from "./Carousel";
import LOGO from "../assets/logo.png";
import client from "../api/client";

const getVoterInfo = () => {
  try {
    return JSON.parse(localStorage.getItem("voterInfo"));
  } catch (e) {
    return null;
  }
};

const apiErrorMessage = (e, fallback) =>
  (e.response && e.response.data && e.response.data.message) || fallback;

const clearVoterSession = () => {
  localStorage.removeItem("voterToken");
  localStorage.removeItem("voterInfo");
};

export function VotersWelcome() {
  const navigate = useNavigate();
  const voter = getVoterInfo();
  const firstname = voter && voter.firstname ? voter.firstname : "Voter";

  return (
    <div className="mt-52 flex flex-col items-center">
      <p className="font-bold text-5xl sm:text-7xl">
        Welcome {firstname.charAt(0).toUpperCase() + firstname.slice(1)}
      </p>
      <p className="text-neutral-500 text-lg sm:text-4xl font-normal">
        Let's walk you through the voting process
      </p>
      {voter && voter.hasVoted && (
        <p className="text-amber-500 text-base sm:text-xl font-normal mt-6">
          Our records show you have already cast your ballot for this election.
        </p>
      )}
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
  const [election, setElection] = useState(null);
  const [error, setError] = useState(null);
  const voter = getVoterInfo();

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await client.get(`election/getElection/${voter.election}`);
        setElection(res.data.data);
      } catch (e) {
        setError(apiErrorMessage(e, "Unable to load your election."));
      }
    };
    if (voter && voter.election) {
      fetchElection();
    } else {
      setError("Your session has no election attached. Please sign in again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (value) => {
    try {
      return format(new Date(value), "PPp");
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="mt-[220px] flex flex-col items-center text-center">
      <p className="font-bold text-5xl sm:text-7xl uppercase">
        {election ? election.name : "Loading election..."}
      </p>
      <p className="text-neutral-500 text-lg sm:text-4xl font-normal">
        Time to choose your preferred candidate
      </p>
      {election && election.from && election.to && (
        <p className="text-neutral-500 text-base sm:text-xl font-normal mt-4">
          Voting opens {formatDate(election.from)} and closes{" "}
          {formatDate(election.to)}
        </p>
      )}
      {error && <p className="text-red-500 text-base mt-4">{error}</p>}
      <button
        onClick={() => {
          navigate("/voters/vote");
        }}
        disabled={!election}
        className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center mt-[180px] text-base font-bold disabled:opacity-50"
      >
        Next <HiArrowNarrowRight />
      </button>
    </div>
  );
}

export function Vote() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const navigate = useNavigate();
  const voter = getVoterInfo();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await client.get(
          `candidate/getAllCandidates/${voter.election}`
        );
        const candidates = (res.data.data || []).map((candidate) => ({
          ...candidate,
          // The API stores one image as a string and several as an array.
          image: Array.isArray(candidate.image)
            ? candidate.image[0]
            : candidate.image,
        }));

        const groupedCandidates = candidates.reduce((acc, candidate) => {
          const position = candidate.position || "Candidate";
          if (acc[position]) {
            acc[position].push(candidate);
          } else {
            acc[position] = [candidate];
          }
          return acc;
        }, {});

        setSections(
          Object.entries(groupedCandidates).map(([position, data]) => ({
            title: position,
            data,
          }))
        );
      } catch (e) {
        setError(apiErrorMessage(e, "Unable to load the candidates."));
      } finally {
        setLoading(false);
      }
    };

    if (voter && voter.election) {
      fetchCandidates();
    } else {
      setError("Your session has no election attached. Please sign in again.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };

  const currentSection = sections[currentSectionIndex];
  const hasSelectionForSection =
    currentSection && Boolean(selectedCandidates[currentSection.title]);

  if (loading) {
    return (
      <p className="mt-52 text-neutral-500 text-2xl text-center">
        Loading candidates...
      </p>
    );
  }
  if (error) {
    return <p className="mt-52 text-red-500 text-2xl text-center">{error}</p>;
  }
  if (sections.length === 0) {
    return (
      <p className="mt-52 text-neutral-500 text-2xl text-center">
        No candidates have been registered for this election yet.
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col items-center">
      {currentSection && (
        <>
          <p className="font-bold text-5xl sm:text-[77px]">
            {currentSection.title}
          </p>
          <Carousel
            key={currentSection.title}
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
                disabled={!hasSelectionForSection}
                className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center text-base font-bold text-white disabled:opacity-50"
              >
                Next <HiArrowNarrowRight />
              </button>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!hasSelectionForSection}
                className="flex gap-2 items-center w-32 h-14 bg-teal-600 justify-center text-base font-bold text-white disabled:opacity-50"
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const selectedCandidates = location.state || {};

  const selections = Object.entries(selectedCandidates).map(
    ([position, candidate]) => ({ ...candidate, position })
  );

  const castBallot = async () => {
    if (selections.length === 0) {
      setError("No candidates selected. Go back and make your choices.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await client.post(
        "voter/vote",
        selections.map((candidate) => ({ _id: candidate._id }))
      );

      const voter = getVoterInfo();
      if (voter) {
        voter.hasVoted = true;
        localStorage.setItem("voterInfo", JSON.stringify(voter));
      }

      navigate("/votingend", {
        state: { receipt: res.data.receipt, selections },
        replace: true,
      });
    } catch (e) {
      if (e.response && e.response.status === 401) {
        clearVoterSession();
        navigate("/voters/login", { replace: true });
        return;
      }
      setError(apiErrorMessage(e, "Your ballot could not be recorded."));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-28 w-screen h-screen overflow-hidden dark:text-white dark:bg-black bg-cover bg-center">
      <div className="flex items-center gap-3">
        <img src={LOGO} alt="blockvote" className="h-4" />
        <h1 className="text-xl font-bold">blockvote</h1>
      </div>
      <p className="mt-8 text-neutral-500 text-xl">
        Review your selections before casting your ballot
      </p>
      <div className="mt-11 w-96 sm:w-auto">
        {selections.map((item) => {
          return (
            <div className="flex gap-4" key={item._id}>
              <p className="w-36 sm:w-60 text-neutral-500 text-3xl font-semibold font-['Outfit'] tracking-wide truncate">
                {item.position}
              </p>
              <p className="w-56 sm:w-auto opacity-50 text-neutral-500 text-3xl font-semibold font-['Outfit'] tracking-wide truncate">
                {" "}
                {item.firstname.charAt(0).toUpperCase() +
                  item.firstname.slice(1)}{" "}
                {item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1)}
              </p>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-red-500 text-base mt-8 max-w-xl text-center">
          {error}
        </p>
      )}

      <button
        className="w-44 h-14 px-6 py-4 bg-teal-600 justify-center items-center mt-[80px] text-white flex gap-2 disabled:opacity-50"
        disabled={submitting}
        onClick={castBallot}
      >
        {submitting ? "Recording..." : "Cast ballot"}
        {!submitting && <HiArrowNarrowRight />}
      </button>
      {submitting && (
        <p className="text-neutral-500 text-sm mt-4">
          Recording your ballot on the blockchain. This can take a few seconds.
        </p>
      )}
    </div>
  );
}

export function VotingEnd() {
  const navigate = useNavigate();
  const location = useLocation();
  const receipt = location.state ? location.state.receipt : null;
  const [verification, setVerification] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const goHome = () => {
    clearVoterSession();
    navigate("/");
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("BlockVote Ballot Receipt", 20, 20);
    doc.setFontSize(11);
    const lines = [
      `Transaction hash: ${receipt.transactionHash}`,
      `Block number: ${receipt.blockNumber}`,
      `Election ID (on-chain): ${receipt.electionId}`,
      `Candidate IDs (on-chain): ${receipt.candidateIds.join(", ")}`,
      `Voter hash: ${receipt.voterHash}`,
      `Ballot receipt: ${receipt.ballotReceipt}`,
      "",
      "Anyone can verify this ballot against the blockchain using the",
      "verifyBallot endpoint or the verifyBallotReceipt contract method.",
    ];
    let y = 35;
    lines.forEach((line) => {
      doc.text(line, 20, y, { maxWidth: 170 });
      y += 8;
    });
    doc.save("blockvote-ballot-receipt.pdf");
  };

  const verifyBallot = async () => {
    setVerifying(true);
    setVerification(null);
    try {
      const res = await client.post("voter/verifyBallot", {
        electionId: receipt.electionId,
        candidateIds: receipt.candidateIds,
        voterHash: receipt.voterHash,
        blockNumber: receipt.blockNumber,
      });
      setVerification({
        valid: res.data.valid,
        message: res.data.message,
      });
    } catch (e) {
      setVerification({
        valid: false,
        message: apiErrorMessage(e, "Verification request failed."),
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-screen min-h-screen overflow-auto dark:text-white bg-[url('./assets/bge.png')] dark:bg-black bg-cover bg-center pb-16">
      <div className="flex gap-2 items-center mt-11">
        <img src={LOGO} alt="blockvote" className="h-4 mt-2" />
        <h1 className="text-xl font-bold mt-2">blockvote</h1>
      </div>
      <p className="text-teal-600 text-7xl sm:text-[180px] font-black font-[Outfit] text-center mt-20">
        Voted
      </p>
      <p className="text-neutral-400 text-xl font-normal font-[Outfit] tracking-wide text-center">
        Your ballot has been cast
      </p>

      {receipt && (
        <div className="mt-10 w-[90%] max-w-2xl border border-neutral-700 rounded-lg p-6 text-left break-all">
          <p className="text-teal-600 text-lg font-bold mb-4">
            Blockchain receipt
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <span className="font-semibold text-neutral-300">
              Transaction hash:{" "}
            </span>
            {receipt.transactionHash}
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <span className="font-semibold text-neutral-300">
              Block number:{" "}
            </span>
            {receipt.blockNumber}
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <span className="font-semibold text-neutral-300">Voter hash: </span>
            {receipt.voterHash}
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <span className="font-semibold text-neutral-300">
              Ballot receipt:{" "}
            </span>
            {receipt.ballotReceipt}
          </p>
          <p className="text-xs text-neutral-500 mt-4">
            Keep this receipt: it proves your ballot is recorded on the
            blockchain exactly as you cast it, without revealing your identity.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              className="h-12 px-6 bg-teal-600 text-white text-sm font-bold"
              onClick={downloadReceipt}
            >
              Download receipt (PDF)
            </button>
            <button
              className="h-12 px-6 border border-teal-600 text-teal-600 text-sm font-bold disabled:opacity-50"
              disabled={verifying}
              onClick={verifyBallot}
            >
              {verifying ? "Verifying..." : "Verify on blockchain"}
            </button>
          </div>

          {verification && (
            <p
              className={`text-sm mt-4 ${
                verification.valid ? "text-teal-500" : "text-red-500"
              }`}
            >
              {verification.message}
            </p>
          )}
        </div>
      )}

      <button
        className="w-40 h-14 px-6 py-4 bg-teal-600 mt-10 text-white"
        onClick={goHome}
      >
        Back to Home
      </button>
    </div>
  );
}
