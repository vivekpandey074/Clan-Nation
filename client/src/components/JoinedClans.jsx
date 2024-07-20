import React from "react";
import clan1 from "../assets/emblems/modernclan2.jpeg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function JoinedClans() {
  const navigate = useNavigate();
  const { joinedclans } = useSelector((state) => state.joinedclans);
  return (
    <div className="h-full w-full p-3 overflow-y-scroll flex flex-col  gap-3 no-scrollbar bg-twitter-black border-t border-black">
      {joinedclans?.length >= 1 ? (
        joinedclans?.map((clan) => {
          return (
            <div
              onClick={() => {
                navigate(`/chat/clan/${clan._id}`);
              }}
              className="flex gap-2 p-4 h-[8vw] cursor-pointer hover:scale-105 ease-out duration-300 hover:bg-black rounded-lg  "
              key={clan._id}
            >
              <img
                src={clan1}
                alt="clanimg"
                className="aspect-square h-20 aspect-square rounded-full"
              />
              <div className="flex flex-col text-custom-gray-text  grow-[3]">
                <h1 className="text-xl">{clan.name}</h1>
                <p className="text-sm">{clan.lastmessage}</p>
                <p className="text-sm">Members: {clan.members.length}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          <h1 className="text-white">You haven't joined any clan</h1>
        </div>
      )}
    </div>
  );
}
