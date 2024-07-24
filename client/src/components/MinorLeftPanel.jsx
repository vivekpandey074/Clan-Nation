import React, { useEffect, useState } from "react";
import "../index.css";
import searchicon from "../assets/searchicon2.svg";
import "../index.css";
import swordsclashing from "../assets/swordclashing.svg";
import sheild from "../assets/shield.svg";
import friendsicon from "../assets/friends.svg";
import bellicon from "../assets/bellicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loaderSlice";
import { SetJoinedClans } from "../redux/joinedClansSlice";
import { toast } from "react-toastify";
import { GetJoinedClansApi } from "../apis/clans";
import JoinedClans from "./JoinedClans";
import Friends from "./Friends";
import Notifications from "./Notifications";
import { useNavigate } from "react-router-dom";

export default function MinorLeftPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { count } = useSelector((state) => state.notifications);
  const [tab, setTab] = useState(1);

  const getJoinedClans = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetJoinedClansApi();
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetJoinedClans(response.joinedclans));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message, { position: "top-right" });
    }
  };

  useEffect(() => {
    getJoinedClans();
  }, []);

  return (
    <div className="h-full w-[24vw] bg-custom-black-2  flex flex-col">
      <div className="p-5 h-[28vh] ">
        <div className="flex flex-wrap flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/findclan")}
            className="text-white flex text-xl justify-center gap-5 w-4/5 bg-black hover:bg-[#24292F]/90  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
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
            className="text-white  flex text-xl justify-center gap-5 w-4/5 bg-black hover:bg-[#24292F]/90 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  dark:hover:bg-[#050708]/30 me-2 mb-2"
          >
            <img
              src={swordsclashing}
              className="h-8 aspect-square"
              alt="searchicon"
            />
            <p>Create Clan</p>
          </button>
        </div>
      </div>

      <div className="h-full w-full  p-3 overflow-y-scroll flex flex-col  gap-3 no-scrollbar bg-twitter-black border-t border-black">
        <div className="text-white bg-[#24292F] p-1 sticky top-0 z-[99] justify-between  w-full h-10 hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/90 ">
          <button
            onClick={() => setTab(1)}
            className={`flex  items-center gap-2  px-2 rounded-sm ${
              tab === 1 ? "bg-custom-black-1" : ""
            }`}
          >
            <img src={sheild} className="h-4 aspect-square" />
            <p> Clans</p>
          </button>
          <button
            onClick={() => setTab(2)}
            className={` flex    items-center gap-2 px-2 rounded-sm ${
              tab === 2 ? "bg-custom-black-1" : ""
            }`}
          >
            <img src={friendsicon} className="h-4 aspect-square" />
            <p> Friends</p>
          </button>
          <button
            onClick={() => setTab(3)}
            className={`items-center gap-2 flex  px-2  rounded-sm ${
              tab === 3 ? "bg-custom-black-1" : ""
            }`}
          >
            <div className="relative ">
              {count > 0 && (
                <div className="rounded-full h-3 p-1 w-auto flex items-center left-[-5px] top-[-5px] w-2 bg-red-500 text-[10px] absolute">
                  {count}
                </div>
              )}
              <img src={bellicon} className="h-4 aspect-square " />
            </div>

            <p>Notifications</p>
          </button>
        </div>
        {tab === 1 ? (
          <JoinedClans />
        ) : tab === 2 ? (
          <Friends />
        ) : (
          <Notifications />
        )}
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
  );
}
