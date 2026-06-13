import React, { useEffect, useState } from "react";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiCheck,
  HiOutlineDownload,
  HiOutlineShieldCheck,
} from "react-icons/hi";
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

/** Mono step marker, like a numbered field on an official form. */
function StepMarker({ step, label }) {
  return (
    <p className="stamp text-teal-600">
      step {step} / 04 — {label}
    </p>
  );
}

export function VotersWelcome() {
  const navigate = useNavigate();
  const voter = getVoterInfo();
  const firstname = voter && voter.firstname ? voter.firstname : "Voter";

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center max-w-3xl py-16">
      <div className="rise">
        <StepMarker step="01" label="welcome" />
      </div>
      <h1 className="rise rise-1 font-display font-bold text-5xl sm:text-7xl mt-5 tracking-tight">
        Welcome,{" "}
        <span className="text-teal-500">
          {firstname.charAt(0).toUpperCase() + firstname.slice(1)}
        </span>
      </h1>
      <p className="rise rise-2 text-neutral-500 text-lg sm:text-2xl font-normal mt-4 leading-relaxed">
        Let's walk you through the voting process.
      </p>
      {voter && voter.hasVoted && (
        <p className="rise rise-3 text-amber-500 text-sm sm:text-base mt-6 border border-amber-500/30 bg-amber-500/5 px-4 py-2">
          Our records show you have already cast your ballot for this election.
        </p>
      )}
      <button
        onClick={() => navigate("info")}
        className="rise rise-3 btn-primary w-36 h-14 mt-16 text-base"
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
    <div className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl py-16">
      <div className="rise">
        <StepMarker step="02" label="your election" />
      </div>
      <h1 className="rise rise-1 font-display font-bold text-4xl sm:text-7xl uppercase mt-5 tracking-tight">
        {election ? election.name : "Loading election..."}
      </h1>
      <p className="rise rise-2 text-neutral-500 text-lg sm:text-2xl font-normal mt-4">
        Time to choose your preferred candidates.
      </p>
      {election && election.from && election.to && (
        <p className="rise rise-3 hash text-neutral-500 mt-6 dark:border-neutral-800 border-neutral-300 border px-4 py-2">
          open {formatDate(election.from)} — closes {formatDate(election.to)}
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-500 text-base mt-6">
          {error}
        </p>
      )}
      <button
        onClick={() => navigate("/voters/vote")}
        disabled={!election}
        className="rise rise-4 btn-primary w-36 h-14 mt-16 text-base"
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
      <p className="flex-1 flex items-center text-neutral-500 text-xl">
        Loading candidates...
      </p>
    );
  }
  if (error) {
    return (
      <p role="alert" className="flex-1 flex items-center text-red-500 text-xl">
        {error}
      </p>
    );
  }
  if (sections.length === 0) {
    return (
      <p className="flex-1 flex items-center text-neutral-500 text-xl text-center">
        No candidates have been registered for this election yet.
      </p>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center py-10 w-full">
      {currentSection && (
        <>
          <div className="rise">
            <StepMarker step="03" label="cast your ballot" />
          </div>
          <p className="rise rise-1 stamp text-neutral-500 mt-5">
            position {currentSectionIndex + 1} of {sections.length}
          </p>
          <h1 className="rise rise-1 font-display font-bold text-4xl sm:text-6xl mt-2 tracking-tight">
            {currentSection.title}
          </h1>
          <div className="rise rise-2 w-full">
            <Carousel
              key={currentSection.title}
              data={currentSection.data}
              onSelect={handleCandidateSelect}
            />
          </div>
          <p className="rise rise-3 text-neutral-500 text-lg font-normal">
            {hasSelectionForSection
              ? "Selection recorded — you can still change it."
              : "Choose your preferred candidate."}
          </p>

          {/* Position progress dots */}
          <div className="rise rise-3 flex gap-2 mt-6" aria-hidden="true">
            {sections.map((section, index) => (
              <span
                key={section.title}
                className={`h-1.5 transition-all duration-300 ${
                  index === currentSectionIndex
                    ? "w-8 bg-teal-500"
                    : selectedCandidates[section.title]
                      ? "w-4 bg-teal-700"
                      : "w-4 dark:bg-neutral-700 bg-neutral-300"
                }`}
              />
            ))}
          </div>

          <div className="rise rise-4 flex gap-4 mt-8">
            {currentSectionIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="btn-ghost w-36 h-14 text-base"
              >
                <HiArrowNarrowLeft /> Previous
              </button>
            )}
            {currentSectionIndex < sections.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!hasSelectionForSection}
                className="btn-primary w-36 h-14 text-base"
              >
                Next <HiArrowNarrowRight />
              </button>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!hasSelectionForSection}
                className="btn-primary w-36 h-14 text-base"
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
    <div className="bg-ledger flex flex-col items-center w-full min-h-dvh dark:text-white text-neutral-900 px-6 py-12">
      <div className="flex items-center gap-2.5">
        <img src={LOGO} alt="" className="h-4" />
        <span className="text-xl font-bold font-display tracking-tight">
          blockvote
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl">
        <div className="rise text-center">
          <StepMarker step="04" label="review and seal" />
          <h1 className="font-display font-bold text-4xl sm:text-6xl mt-5 tracking-tight">
            Review your ballot
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg mt-3">
            Once cast, your ballot is sealed on the blockchain and cannot be
            changed.
          </p>
        </div>

        <div className="rise rise-2 w-full mt-10 border dark:border-neutral-800 border-neutral-300 dark:bg-black/40 bg-white/60">
          {selections.map((item, index) => (
            <div
              key={item._id}
              className={`flex items-center justify-between gap-4 px-5 sm:px-7 py-4 ${
                index > 0
                  ? "border-t dark:border-neutral-800 border-neutral-300"
                  : ""
              }`}
            >
              <p className="stamp text-neutral-500 shrink-0">{item.position}</p>
              <p className="font-display text-lg sm:text-2xl font-semibold tracking-tight text-right truncate">
                {item.firstname.charAt(0).toUpperCase() +
                  item.firstname.slice(1)}{" "}
                {item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1)}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="text-red-500 text-sm mt-6 max-w-xl text-center border border-red-500/30 bg-red-500/5 px-4 py-2"
          >
            {error}
          </p>
        )}

        <button
          className="rise rise-3 btn-primary w-48 h-14 mt-10 text-base"
          disabled={submitting}
          onClick={castBallot}
        >
          {submitting ? "Sealing..." : "Cast ballot"}
          {!submitting && <HiArrowNarrowRight />}
        </button>
        {submitting && (
          <p className="text-neutral-500 text-sm mt-4" aria-live="polite">
            Recording your ballot on the blockchain. This can take a few
            seconds.
          </p>
        )}
      </div>
    </div>
  );
}

/** One labelled mono row on the receipt stub. */
function ReceiptField({ label, value }) {
  return (
    <div className="px-6 sm:px-8 py-3 border-t dark:border-neutral-800 border-neutral-300">
      <p className="stamp text-neutral-500">{label}</p>
      <p className="hash dark:text-teal-300 text-teal-700 mt-1">{value}</p>
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
    <div className="bg-ledger flex flex-col items-center w-full min-h-dvh dark:text-white text-neutral-900 px-6 py-12">
      <div className="flex items-center gap-2.5">
        <img src={LOGO} alt="" className="h-4" />
        <span className="text-xl font-bold font-display tracking-tight">
          blockvote
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl py-10">
        <div className="rise stamp-in flex items-center justify-center gap-2 border-2 border-teal-500 text-teal-500 px-5 py-2 -rotate-2">
          <HiCheck size={20} />
          <span className="stamp text-base">voted</span>
        </div>
        <h1 className="rise rise-1 font-display font-bold text-4xl sm:text-6xl mt-7 tracking-tight text-center">
          Your ballot is sealed
        </h1>
        <p className="rise rise-2 text-neutral-500 text-base sm:text-lg mt-3 text-center">
          {receipt
            ? "Recorded on the blockchain — keep the receipt below."
            : "Your ballot has been recorded."}
        </p>

        {receipt && (
          <div className="rise rise-3 w-full mt-10 border dark:border-neutral-800 border-neutral-300 dark:bg-black/40 bg-white/70">
            <div className="flex items-center justify-between px-6 sm:px-8 py-4">
              <p className="stamp dark:text-white text-neutral-900">
                ballot receipt
              </p>
              <p className="hash text-neutral-500">
                block #{receipt.blockNumber}
              </p>
            </div>
            <div className="perforation dark:text-white text-neutral-900 mx-4" />
            <ReceiptField
              label="transaction hash"
              value={receipt.transactionHash}
            />
            <ReceiptField label="voter hash" value={receipt.voterHash} />
            <ReceiptField
              label="ballot receipt"
              value={receipt.ballotReceipt}
            />
            <div className="px-6 sm:px-8 py-4 border-t dark:border-neutral-800 border-neutral-300">
              <p className="text-xs text-neutral-500 leading-relaxed">
                This receipt proves your ballot is recorded on the blockchain
                exactly as you cast it — without revealing your identity.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  className="btn-primary h-12 px-5 text-sm"
                  onClick={downloadReceipt}
                >
                  <HiOutlineDownload size={16} />
                  Download PDF
                </button>
                <button
                  className="btn-ghost h-12 px-5 text-sm"
                  disabled={verifying}
                  onClick={verifyBallot}
                >
                  <HiOutlineShieldCheck size={16} />
                  {verifying ? "Verifying..." : "Verify on blockchain"}
                </button>
              </div>
              {verification && (
                <p
                  role="status"
                  className={`text-sm mt-4 px-3 py-2 border ${
                    verification.valid
                      ? "text-teal-500 border-teal-500/30 bg-teal-500/5"
                      : "text-red-500 border-red-500/30 bg-red-500/5"
                  }`}
                >
                  {verification.message}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          className="rise rise-4 btn-ghost w-44 h-12 mt-10 text-sm"
          onClick={goHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
