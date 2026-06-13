import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { HiOutlineSave, HiOutlineUserGroup, HiOutlineUser, HiOutlineChartBar } from "react-icons/hi";
import BarChart from "./Chart";
import { generatePDF } from "./PDFGenerator";
import client from "../api/client";

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-[#0c0c0c] border border-neutral-800 px-6 py-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="stamp text-neutral-500">{label}</p>
        <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export default function Overview() {
  const today = new Date();
  const formattedDate = format(today, "EEE dd MMM, yyy");

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  // "chain" when results came from the on-chain canonical tally, "database"
  // when we fell back to Mongo (e.g. chain not configured in dev).
  const [source, setSource] = useState("chain");

  const electionId = localStorage.getItem("electionId");

  useEffect(() => {
    if (!electionId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      // Registered voters always come from the database (the chain only stores
      // the roll's Merkle root, not the list).
      try {
        const vot = await client.get(`voter/getAllVoters/${electionId}`);
        setVoters(vot.data.data || []);
      } catch (e) {
        /* interceptor handles 401 */
      }

      // Prefer the canonical on-chain tally; fall back to Mongo if the election
      // is not on-chain yet.
      try {
        const res = await client.get(`election/results/${electionId}`);
        setElection({
          name: res.data.election.name,
          state: res.data.election.state,
          totalBallots: res.data.election.totalBallots,
        });
        setCandidates(
          res.data.results.map((r) => ({
            key: r.candidateId,
            name: r.name,
            position: r.position,
            votes: r.votes,
          }))
        );
        setSource("chain");
      } catch (e) {
        try {
          const [el, cand] = await Promise.all([
            client.get(`election/getElection/${electionId}`),
            client.get(`candidate/getAllCandidates/${electionId}`),
          ]);
          setElection({ name: el.data.data.name });
          // No chain configured: we can list candidates but votes only exist
          // on-chain, so the tally is unavailable (shown as 0).
          setCandidates(
            (cand.data.data || []).map((c) => ({
              key: c._id,
              name: `${c.firstname} ${c.lastname}`,
              position: c.position,
              votes: 0,
            }))
          );
          setSource("database");
        } catch (e2) {
          /* interceptor handles 401 */
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [electionId]);

  // Ballots cast comes from the chain (totalBallots). Without the chain there
  // is no tally, so it is unknown (0).
  const ballotsCast =
    election && election.totalBallots != null ? election.totalBallots : 0;
  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
  const turnout = voters.length
    ? Math.round((ballotsCast / voters.length) * 100)
    : 0;

  const ranked = candidates; // already sorted by votes (desc)
  const chartLabels = ranked.map((c) => c.name);
  const chartValues = ranked.map((c) => c.votes || 0);

  return (
    <div className="text-white" id="pdf-content">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="stamp text-neutral-500">{formattedDate}</p>
          <h1 className="text-3xl font-bold font-display tracking-tight mt-1">
            {election ? election.name : "Overview"}
          </h1>
        </div>
        <button
          onClick={generatePDF}
          className="font-medium text-sm gap-2 flex h-10 px-4 justify-center bg-teal-600 hover:bg-teal-500 rounded-lg items-center"
        >
          Export
          <HiOutlineSave fontSize={18} />
        </button>
      </div>

      {!electionId ? (
        <div className="mt-16 text-center text-neutral-500">
          <p className="text-lg">No election selected.</p>
          <p className="text-sm mt-2">
            Create an election to see live results here.
          </p>
        </div>
      ) : loading ? (
        <p className="mt-16 text-center text-neutral-500">Loading results...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <StatCard
              icon={<HiOutlineUserGroup />}
              label="registered voters"
              value={voters.length}
            />
            <StatCard
              icon={<HiOutlineUser />}
              label="candidates"
              value={candidates.length}
            />
            <StatCard
              icon={<HiOutlineChartBar />}
              label="ballots cast"
              value={ballotsCast}
            />
            <StatCard
              icon={<HiOutlineChartBar />}
              label={`turnout (${ballotsCast}/${voters.length})`}
              value={`${turnout}%`}
            />
          </div>

          {/* Chart + standings side by side on wide screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="border border-neutral-800 bg-[#0c0c0c] rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-lg font-bold font-display tracking-tight">
                    Live results
                  </p>
                  <p className="stamp text-neutral-500 mt-1">
                    {source === "chain"
                      ? "● canonical — read from the blockchain"
                      : "○ tally unavailable — election not on-chain"}
                  </p>
                </div>
                <p className="stamp text-neutral-500">
                  {totalVotes} votes counted
                </p>
              </div>
              <BarChart labels={chartLabels} values={chartValues} />
            </div>

            <div className="rounded-xl bg-[#0c0c0c] border border-neutral-800 px-6 py-6">
              <p className="text-lg font-bold font-display tracking-tight mb-4">
                Candidate standings
              </p>
              <table className="table-fixed w-full">
              <thead>
                <tr>
                  <th className="stamp text-neutral-500">Candidate</th>
                  <th className="stamp text-neutral-500">Position</th>
                  <th className="stamp text-neutral-500 text-right">Votes</th>
                </tr>
              </thead>
              <tbody>
                {ranked.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-neutral-500 text-sm text-center py-6"
                    >
                      No candidates registered yet.
                    </td>
                  </tr>
                ) : (
                  ranked.map((c) => (
                    <tr key={c.key}>
                      <td className="text-white text-sm font-medium">
                        {c.name}
                      </td>
                      <td className="text-neutral-400 text-sm">{c.position}</td>
                      <td className="text-teal-400 text-sm font-semibold text-right">
                        {c.votes || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
