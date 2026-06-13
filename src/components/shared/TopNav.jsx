import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import LOGO from "../../assets/logo.png";
import PROFILE_IMAGE from "../../assets/profile.jpg";
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/const/navigation";
import client from "../../api/client";

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

    (async () => {
      try {
        const res = await client.get(
          `election/getOrganizationElections/${org._id}`
        );
        const list = res.data.data || [];
        setElections(list);
        if (!localStorage.getItem("electionId") && list[0]) {
          localStorage.setItem("electionId", list[0]._id);
          setSelectedId(list[0]._id);
        }
      } catch (e) {
        /* interceptor handles 401 */
      }
    })();
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    localStorage.setItem("electionId", id);
    window.location.reload(); // active election is global to the dashboard
  };

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-[#060606] border-b border-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img src={LOGO} alt="" className="h-4" />
          <span className="text-xl font-bold font-display tracking-tight hidden sm:block">
            blockvote
          </span>
        </div>

        {/* Primary nav */}
        <nav className="flex items-center gap-1 overflow-x-auto">
          {DASHBOARD_SIDEBAR_LINKS.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.key}
                to={link.path}
                className={`flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover:no-underline ${
                  active
                    ? "bg-neutral-900 text-teal-400"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto shrink-0">
          {elections.length > 0 && (
            <label className="flex items-center gap-2">
              <span className="stamp text-neutral-500 hidden lg:inline">
                election
              </span>
              <select
                value={selectedId}
                onChange={handleSelect}
                className="h-9 px-3 bg-[#0c0c0c] border border-neutral-700 rounded-lg text-sm text-white focus:border-teal-600 focus:outline-none max-w-[160px]"
              >
                {elections.map((el) => (
                  <option key={el._id} value={el._id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold">{userInfo.name}</span>
            <span className="stamp text-teal-500">admin</span>
          </div>
          <img
            src={PROFILE_IMAGE}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700"
          />
          <button
            onClick={logout}
            aria-label="Log out"
            className="h-9 w-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-neutral-800 bg-transparent"
          >
            <HiOutlineLogout size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
