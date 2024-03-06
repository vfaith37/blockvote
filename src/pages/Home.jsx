import { Switch } from "@material-tailwind/react";
import React from "react";
import {
  FaHeart,
  FaStar,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaMoon,
} from "react-icons/fa";
import { Name } from "../Component/Name";

export const Home = () => {
  const iconSize = 24;
  return (
    <div>
      <div className="mx-auto flex justify-between pt-5">
        <div className="flex gap-3">
          <FaTwitter
            className="hover:text-blue-700 cursor-pointer"
            size={iconSize}
          />
          <FaLinkedin
            className="hover:text-blue-700 cursor-pointer"
            size={iconSize}
          />
          <FaGithub
            className="hover:text-gray-900 cursor-pointer"
            size={iconSize}
          />
        </div>
        {/* <div className="Rectangle2 w-28 h-16 bg-zinc-300 rounded-3xl">
          <FaMoon />
        </div> */}
        <Switch
          id="custom-switch-component"
          ripple={false}
          className="h-full w-full checked:bg-zinc-300"
          containerProps={{
            className: "w-20 h-10",
          }}
          circleProps={{
            className: "before:hidden left-0.5 border-none h-9 w-10",
          }}
        />
      </div>
      <div className="pt-15">
        <Name />
      </div>
      <text className="text-white text-8xl font-extrabold">Simisola</text>

      <div></div>
    </div>
  );
};
