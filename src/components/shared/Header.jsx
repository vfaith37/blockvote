import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import PROFILE_IMAGE from "../../assets/profile.jpg";
import client from "../../api/client";

export default function Header() {
  const [userInfo, setUserInfo] = useState("");
  const [elections, setElections] = useState([]);
  const [selectedId, setSelectedId] = useState(
    localStorage.getItem("electionId") || ""
  );

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (!stored) return;
    const org = JSON.parse(stored);
    setUserInfo(org);

    const loadElections = async () => {
      try {
        const res = await client.get(
          `election/getOrganizationElections/${org._id}`
        );
        const list = res.data.data || [];
        setElections(list);
        // Default the active election if none chosen yet.
        if (!localStorage.getItem("electionId") && list[0]) {
          localStorage.setItem("electionId", list[0]._id);
          setSelectedId(list[0]._id);
        }
      } catch (e) {
        // Interceptor handles 401s; nothing else to do here.
      }
    };
    loadElections();
  }, []);

  // Switching the active election is global to the dashboard, so reload to let
  // every screen pick up the new electionId consistently.
  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    localStorage.setItem("electionId", id);
    window.location.reload();
  };

  return (
    <div className="bg-[#060606] border-b border-neutral-800 h-16 px-5 flex justify-between gap-4 text-white items-center">
      <div className="relative border border-neutral-700 rounded-lg focus-within:border-teal-600 transition-colors hidden md:block">
        <HiOutlineSearch
          fontSize={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
        />
        <input
          type="text"
          placeholder="Search here"
          className="h-10 focus:outline-none w-[14rem] lg:w-[20rem] bg-transparent text-white text-sm pl-10 pr-4 placeholder:text-neutral-500"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {elections.length > 0 && (
          <label className="flex items-center gap-2">
            <span className="stamp text-neutral-500 hidden sm:inline">
              election
            </span>
            <select
              value={selectedId}
              onChange={handleSelect}
              className="h-10 px-3 bg-[#0c0c0c] border border-neutral-700 rounded-lg text-sm text-white focus:border-teal-600 focus:outline-none max-w-[200px]"
            >
              {elections.map((el) => (
                <option key={el._id} value={el._id}>
                  {el.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex gap-3 items-center">
          <div className="flex flex-col items-end">
            <p className="text-white text-sm font-semibold">{userInfo.name}</p>
            <p className="stamp text-teal-500">admin</p>
          </div>
          <img
            src={PROFILE_IMAGE}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700"
          />
        </div>
      </div>
    </div>
  );
}
