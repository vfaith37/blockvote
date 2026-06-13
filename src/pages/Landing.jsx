import React, { useEffect, useState } from "react";
import WEB_IMAGE from "../assets/web.png";
import LOGO from "../assets/logo.png";
import DASHBOARD_IMAGE from "../assets/dashboard.png";
import DASHBOARD_IMG from "../assets/img.png";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  HiMoon,
  HiSun,
  HiArrowNarrowRight,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const STEPS = [
  {
    number: "01",
    title: "Get App",
    body: "BlockVote's platform provides essential features that empower users to engage in the democratic process, fostering safe and secured ballot submission without disclosing voter identity.",
  },
  {
    number: "02",
    title: "Accessibility",
    body: "Blockchain voting improves accessibility by enabling remote voting through digital devices such as smartphones or computers.",
  },
  {
    number: "03",
    title: "Transparency",
    body: "Every transaction, from the casting of votes to the tallying of results, is recorded on the blockchain and is visible to all participants.",
  },
];

const FAQS = [
  "Do you possess the knowledge to help me with my election?",
  "What is Blockvote?",
  "Are there any gas fees incurred?",
  "How can I get a proposal?",
];

export default function Landing() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      localStorage.setItem("theme", theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const handleSwitch = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="bg-ledger w-full min-h-dvh text-neutral-900 dark:text-white py-8 px-6 md:px-16 lg:px-24">
      {/* Nav */}
      <nav className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img src={LOGO} alt="" className="h-4" />
          <span className="text-xl font-bold font-display tracking-tight">
            blockvote
          </span>
        </div>

        <div className="hidden md:flex gap-10">
          {[
            ["#services", "Services"],
            ["#about", "About"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="stamp text-neutral-500 hover:text-teal-500 hover:no-underline pt-1"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/organization")}
            className="btn-primary h-11 px-5 text-sm"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("organization/signup")}
            className="btn-ghost h-11 px-5 text-sm"
          >
            Sign Up
          </button>
          <button
            onClick={handleSwitch}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="h-11 w-11 flex items-center justify-center text-neutral-500 hover:text-teal-500"
          >
            {theme === "dark" ? <HiMoon size={24} /> : <HiSun size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col lg:flex-row justify-between py-20 lg:py-28 items-center gap-12">
        <div className="max-w-xl">
          <p className="rise stamp text-teal-600">
            verifiable elections, sealed on-chain
          </p>
          <h1 className="rise rise-1 font-display text-5xl sm:text-6xl font-bold mt-5 tracking-tight leading-[1.05]">
            <span className="text-teal-500">Secure</span> &{" "}
            <span className="text-teal-500">accessible</span> voting at your
            fingertips.
          </h1>
          <p className="rise rise-2 text-base sm:text-lg font-normal text-neutral-500 mt-6 leading-relaxed">
            A specialized voting platform based on the blockchain, designed for
            voters and candidates — facilitating a smooth electoral process
            across multiple channels.
          </p>
          <div className="rise rise-3 flex flex-wrap gap-4 mt-9">
            <button
              onClick={() => navigate("organization/signup")}
              className="btn-primary h-14 px-7 text-base"
            >
              Get Started <HiArrowNarrowRight />
            </button>
            <button
              onClick={() => navigate("/voters/login")}
              className="btn-ghost h-14 px-7 text-base"
            >
              I'm here to vote
            </button>
          </div>
          <p className="rise rise-4 flex items-center gap-2 text-neutral-500 text-xs mt-8">
            <HiOutlineShieldCheck size={14} className="text-teal-600" />
            <span className="stamp">
              every ballot independently verifiable
            </span>
          </p>
        </div>
        <img
          src={WEB_IMAGE}
          alt="Illustration of secure online voting"
          className="w-full max-w-md lg:max-w-[520px]"
        />
      </div>

      {/* Services */}
      <section className="py-20 flex flex-col items-center" id="services">
        <p className="stamp text-teal-600">what we do</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-center tracking-tight">
          Our mission explained
        </h2>
        <p className="text-base sm:text-lg text-neutral-500 text-center max-w-2xl mt-4 leading-relaxed">
          We leverage cutting-edge technology so people can vote securely from
          anywhere and administrators can manage elections with ease.
        </p>
        <div className="mt-14 border dark:border-neutral-800 border-neutral-300 p-2 dark:bg-black/40 bg-white/60">
          <img src={DASHBOARD_IMAGE} alt="BlockVote dashboard preview" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="flex flex-col items-center">
          <p className="stamp text-teal-600">how it works</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-center tracking-tight">
            Voting made simple and reliable
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 text-center max-w-2xl mt-4 leading-relaxed">
            A blockchain voting system provides a decentralized, secure, and
            transparent platform for conducting elections.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center mt-16 gap-12">
          <div className="flex flex-col gap-10 max-w-xl">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-6">
                <p className="stamp text-teal-500 text-xl pt-1.5 shrink-0">
                  {step.number}
                </p>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-neutral-500 text-base mt-2 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <img
            src={DASHBOARD_IMG}
            alt="BlockVote election management"
            className="w-full max-w-xl"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" id="about">
        <p className="stamp text-teal-600 text-center">faq</p>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-center mt-3 tracking-tight">
          Everything you need to know
        </h2>
        <div className="max-w-3xl mx-auto mt-12 border-t dark:border-neutral-800 border-neutral-300">
          {FAQS.map((question) => (
            <p
              key={question}
              className="text-lg sm:text-xl font-medium tracking-wide py-6 border-b dark:border-neutral-800 border-neutral-300"
            >
              {question}
            </p>
          ))}
        </div>
      </section>

      {/* Contact / footer */}
      <footer
        className="flex flex-col md:flex-row justify-between gap-12 py-16 border-t dark:border-neutral-800 border-neutral-300"
        id="contact"
      >
        <div>
          <p className="font-display text-3xl font-bold tracking-tight">
            Say hi to our team
          </p>
          <div className="flex gap-5 py-5 text-neutral-500">
            <FaXTwitter className="h-6 w-6 hover:text-teal-500 cursor-pointer" />
            <FaInstagram className="h-6 w-6 hover:text-teal-500 cursor-pointer" />
            <FaLinkedin className="h-6 w-6 hover:text-teal-500 cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-wrap gap-12">
          {[
            ["Contact", ["+234-913-9073-466", "Babcock University"]],
            ["Socials", ["Instagram", "X", "Linkedin"]],
            ["Company", ["About", "Terms", "Privacy"]],
            ["Products", ["Busa APP", "Ease"]],
          ].map(([title, items]) => (
            <div key={title}>
              <p className="stamp text-neutral-400 dark:text-neutral-300">
                {title}
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                {items.map((item) => (
                  <p key={item} className="text-neutral-500 text-base">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
      <p className="stamp py-6 text-center text-neutral-500">
        the future of voting is just a tap away
      </p>
    </div>
  );
}
