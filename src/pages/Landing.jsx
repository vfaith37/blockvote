import React from "react";
import WEB_IMAGE from "../assets/web.png";
import LOGO from "../assets/logo.png";
import DASHBOARD_IMAGE from "../assets/dashboard.png";
import DASHBOARD_IMG from "../assets/img.png";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-black text-white py-10 px-36 scroll-smooth touch-auto bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-600 via-black to-black ">
      <div className="flex justify-between h-10 items-center">
        <div className="flex items-center gap-2 px-2 py-3">
          <img src={LOGO} alt="blockvote" className="h-4" />
          <h1 className="text-xl font-bold mr-auto">blockvote</h1>
        </div>

        <div className="flex gap-20">
          <a href="#services" className="text-white hover:text-teal-600">
            <div className="text-lg font-medium">Services</div>
          </a>
          <a href="#about" className="text-white hover:text-teal-600">
            <div className="text-lg font-medium">About</div>
          </a>
          <a href="#contact" className="text-white hover:text-teal-600">
            <div className="text-lg font-medium">Contact</div>
          </a>
        </div>

        <div className="flex gap-10">
          <button
            onClick={() => navigate("/organization")}
            className="w-28 h-12 bg-teal-600 justify-center items-center inline-flex cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("organization/signup")}
            className="text-lg font-medium w-28 h-12 border justify-center items-center inline-flex cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
      <div className="flex justify-between py-20 items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-black to-black">
        <div className="w-[587px]">
          <p className="text-6xl font-bold pb-8">
            <span className="text-teal-600">Secure</span> &{" "}
            <span className="text-teal-600">accessible</span> voting at your
            fingertips.
          </p>
          <p className="text-white text-base font-medium">
            A specialized voting platform based on{" "}
            <span className="text-neutral-600 font-extrabold">blockchain</span>{" "}
            designed for Voters and Candidates, facilitating a smooth electoral
            process across multiple <br />
            channels.
          </p>
          <div className="bg-teal-600 w-36 h-14 flex justify-center items-center my-8">
            <p className="text-white text-base font-bold">Get Started</p>
          </div>
        </div>
        <img src={WEB_IMAGE} alt="web" className="w-[550px] h-[550px]" />
      </div>

      <div className="py-16" id="services">
        <div className="flex flex-col items-center">
          <p className="text-teal-600 text-2xl font-bold">WHAT WE DO</p>
          <p className="text-4xl font-bold">Our mission explained</p>
          <p className="text-2xl font-normal text-center">
            Our mission explained We leverage cutting-edge technology so people
            can vote securely from anywhere and <br />
            administrators can manage elections with ease.
          </p>
        </div>
        <img src={DASHBOARD_IMAGE} className="py-20 mx-36" alt="dashboard" />
      </div>

      <div className="py-10">
        <div className="flex flex-col items-center">
          <p className="text-teal-600 text-2xl font-bold">HOW IT WORKS</p>
          <p className="text-4xl font-bold text-center">
            Voting made simple and <br />
            reliable
          </p>
          <p className="text-2xl font-normal text-center">
            A blockchain voting system provides a decentralized, secure, and
            transparent platform <br />
            for conducting elections.
          </p>
        </div>
        <div className="flex justify-between mt-[81px]">
          <div>
            <div className="flex gap-4 m-[40px]">
              <div className="bg-teal-600 flex flex-col justify-center items-center h-12 w-12 rounded-xl">
                <p className="text-2xl font-bold">1</p>
              </div>
              <div>
                <p className="text-2xl font-medium mb-[10px]">Get App</p>
                <p className="w-96 text-zinc-400 text-xl font-normal">
                  BlockVote's platform provides essential features that empower
                  users to engage in democratic process, fostering a safe and
                  secured ballot submission without disclosing voter identity.
                </p>
              </div>
            </div>
            <div className="flex gap-4 m-[40px]">
              <div className="bg-teal-600 flex flex-col justify-center items-center h-12 w-12 rounded-xl">
                <p className="text-2xl font-bold">2</p>
              </div>
              <div>
                <p className="text-2xl font-medium mb-[10px]">Accessibility</p>
                <p className="w-96 text-zinc-400 text-xl font-normal">
                  Blockchain voting systems can improve accessibility by
                  enabling remote voting through digital devices such as
                  smartphones or computers.
                </p>
              </div>
            </div>
            <div className="flex gap-4 m-[40px]">
              <div className="bg-teal-600 flex flex-col justify-center items-center h-12 w-12 rounded-xl">
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-2xl font-medium mb-[10px]">Transparency</p>
                <p className="w-96 text-zinc-400 text-xl font-normal">
                  Every transaction, from the casting of votes to the tallying
                  of results, is recorded on the blockchain and is visible to
                  all participants.
                </p>
              </div>
            </div>
          </div>
          <img src={DASHBOARD_IMG} alt="blockvote" className="" />
        </div>
        {/* <img src={DASHBOARD_IMAGE} className="py-20 mx-36" alt="dashboard" /> */}
      </div>

      {/* <div className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-600 via-black to-black"> */}
      <div className="py-6 " id="about">
        <p className="text-6xl font-medium text-center">
          Everything you need to <br />
          know
        </p>
        <div className="flex flex-col items-start py-20 gap-20">
          <p className="text-3xl font-medium tracking-wide">
            Do you possess the knowledge to help me with my election?
          </p>
          <p className="text-3xl font-medium tracking-wide">
            What is Blockvote
          </p>
          <p className="text-3xl font-medium tracking-wide">
            Are there any gas fees incurred
          </p>
          <p className="text-3xl font-medium tracking-wide">
            How can I get a proposal?
          </p>
        </div>
      </div>

      <div className="flex justify-between" id="contact">
        <div>
          <p className="text-4xl font-bold">
            Say Hi to our <br />
            team
          </p>
          <div className="flex gap-2 py-4">
            {/* <HiOutlineInsta */}
            <FaXTwitter className="h-10 w-11" />
            <FaInstagram className="h-10 w-11" />
            <FaLinkedin className="h-10 w-11" />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="">
            <p className="text-2xl font-medium">Contact</p>
            <p className="text-zinc-400 text-xl font-normal">
              +234-913-9073-466
            </p>
            <p className="text-zinc-400 text-xl font-normal">
              Babcock University
            </p>
          </div>
          <div className="">
            <p className="text-2xl font-medium">Socials</p>
            <p className="text-zinc-400 text-xl font-normal">Instagram</p>
            <p className="text-zinc-400 text-xl font-normal">X</p>
            <p className="text-zinc-400 text-xl font-normal">Linkedin</p>
          </div>
          <div className="">
            <p className="text-2xl font-medium">Company</p>
            <p className="text-zinc-400 text-xl font-normal">About</p>
            <p className="text-zinc-400 text-xl font-normal">Terms</p>
            <p className="text-zinc-400 text-xl font-normal">Privacy</p>
          </div>
          <div className="">
            <p className="text-2xl font-medium">Products</p>
            <p className="text-zinc-400 text-xl font-normal">Busa APP</p>
            <p className="text-zinc-400 text-xl font-normal">Ease</p>
          </div>
        </div>
      </div>
      <p className="py-4 text-center opacity-70 text-zinc-400 text-xl font-normal">
        The future of voting is just a tap away
      </p>
      {/* </div> */}
    </div>
  );
}
