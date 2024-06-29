import React from "react";
import "../index.css";
import searchicon from "../assets/searchicon2.svg";
import "../index.css";
import swordsclashing from "../assets/swordclashing.svg";
import clan1 from "../assets/emblems/clanemblem.png";
import { useNavigate } from "react-router-dom";

export default function MinorLeftPanel() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-[24vw] bg-custom-black-2 flex flex-col">
      <div className="  p-5 h-[28vh] ">
        <div className="flex flex-wrap flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/findclan")}
            className="text-white flex text-xl justify-center gap-5 w-4/5 bg-black hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
          >
            <img
              src={searchicon}
              className="h-8 aspect-square"
              alt="searchicon"
            />
            <p>Find Clan</p>
          </button>
          <button
            type="button"
            onClick={() => navigate("/createclan")}
            className="text-white flex text-xl justify-center gap-5 w-4/5 bg-black hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
          >
            <img
              src={swordsclashing}
              className="h-8 aspect-square"
              alt="searchicon"
            />
            <p>Create Clan</p>
          </button>
        </div>
        <div className="Bevan-font flex  text-custom-gray-text w-full p-2 justify-around">
          <div className="cursor-pointer" onClick={() => navigate("/blogs")}>
            #Blogs
          </div>
          <div className="cursor-pointer" onClick={() => navigate("/news")}>
            #Updates
          </div>
          <div className="cursor-pointer" onClick={() => navigate("/updates")}>
            #News
          </div>
        </div>
      </div>
      <div className="h-full w-full p-3 overflow-y-scroll flex flex-col  gap-3 no-scrollbar ">
        <div className="flex gap-2 p-4 h-[8vw] ">
          <img
            src={clan1}
            alt="clanimg"
            className="grow-[1] aspect-square h-20"
          />
          <div className="flex flex-col text-custom-gray-text  grow-[3]">
            <h1 className="text-xl">Dark Invaders cutstom</h1>
            <p className="text-sm">This is latest message in chatbox</p>
            <p className="text-sm">Online: 12/48</p>
          </div>
        </div>
        <div className="flex gap-2 border-2 border-black rounded-lg bg-[#BFC9CA] p-4 h-[8vw] ">
          <img
            src={clan1}
            alt="clanimg"
            className="grow-[1] aspect-square h-20"
          />
          <div className="flex flex-col grow-[3]">
            <h1 className="text-xl">Dark Invaders cutstom</h1>
            <p className="text-sm">This is latest message in chatbox</p>
            <p className="text-sm">Online: 12/48</p>
          </div>
        </div>

        <div className="flex gap-2  p-4 h-[8vw] ">
          <img
            src={clan1}
            alt="clanimg"
            className="grow-[1] aspect-square h-20"
          />
          <div className="flex flex-col text-custom-gray-text  grow-[3]">
            <h1 className="text-xl">Dark Invaders cutstom</h1>
            <p className="text-sm">This is latest message in chatbox</p>
            <p className="text-sm">Online: 12/48</p>
          </div>
        </div>
        <div className="flex gap-2  p-4 h-[8vw] ">
          <img
            src={clan1}
            alt="clanimg"
            className="grow-[1] aspect-square h-20"
          />
          <div className="flex flex-col text-custom-gray-text  grow-[3]">
            <h1 className="text-xl">Dark Invaders cutstom</h1>
            <p className="text-sm">This is latest message in chatbox</p>
            <p className="text-sm">Online: 12/48</p>
          </div>
        </div>
        <div className="flex gap-2  p-4 h-[8vw] ">
          <img
            src={clan1}
            alt="clanimg"
            className="grow-[1] aspect-square h-20"
          />
          <div className="flex flex-col text-custom-gray-text  grow-[3]">
            <h1 className="text-xl">Dark Invaders cutstom</h1>
            <p className="text-sm">This is latest message in chatbox</p>
            <p className="text-sm">Online: 12/48</p>
          </div>
        </div>
      </div>
      <div
        type="button"
        className="text-white bg-[#24292F]   w-full h-10 hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 "
      >
        Sign in with Github
      </div>
    </div>
  );
}
