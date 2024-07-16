import React, { useEffect, useState } from "react";

import trophy from "../../assets/trophy2.svg";
import modernclan from "../../assets/emblems/modernclan1.jpeg";
import "../../index.css";
import defaultuser from "../../assets/defaultuserimage.png";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetClanDetailsApi, JoinClanApi, LeaveClanApi } from "../../apis/clans";
import { toast } from "react-toastify";
import { SetLoader } from "../../redux/loaderSlice";
import { SetJoinedClans } from "../../redux/joinedClansSlice";

export default function ClanDetails() {
  const navigate = useNavigate();
  const [clan, setClan] = useState({});
  const dispatch = useDispatch();
  const { joinedclans } = useSelector((state) => state.joinedclans);
  const { user } = useSelector((state) => state.users);
  const { clanId } = useParams();
  const [isJoined, SetIsJoined] = useState(false);

  const getClanDetails = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetClanDetailsApi(clanId);
      dispatch(SetLoader(false));
      if (response.success) {
        setClan(() => response.clan);
        if (check(response.clan, user)) {
          SetIsJoined(true);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Could not fetch clan details", {
        position: "top-right",
      });
    }
  };

  const handleJoinClan = async (clan) => {
    try {
      dispatch(SetLoader(true));

      const response = await JoinClanApi(clan, user);
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetJoinedClans([...joinedclans, clan]));
        SetIsJoined(true);
        toast.success("Clan joined successfully");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Error while joining clan", {
        position: "top-right",
      });
    }
  };

  const handleleaveclan = async (clan) => {
    try {
      dispatch(SetLoader(true));
      const response = await LeaveClanApi(clan);
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetJoinedClans(joinedclans.filter((x) => x._id !== clan._id)));
        SetIsJoined(false);
        toast.success("Clan leaved succesfully");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(
        err.message || "Error while leaving clan",

        { position: "top-right" }
      );
    }
  };

  const check = (clan, user) => {
    console.log(clan, user);
    for (let index = 0; index < clan?.members?.length; index++) {
      if (clan.members[index]._id === user._id) return true;
    }

    return false;
  };
  useEffect(() => {
    if (user) {
      getClanDetails();
    }
  }, [user, isJoined]);

  return (
    <div className=" h-full bg-black">
      <div className=" flex  h-[40vh] overflow-scroll no-scrollbar">
        <div className="w-1/3 h-full  flex justify-center">
          {" "}
          <img className="aspect-[16/9]" src={modernclan} alt="" />
        </div>
        <div className="flex flex-col text-custom-gray-text box-border p-5  w-2/3">
          <div className="flex items-center justify-between">
            <h1 className="text-6xl mb-4">{clan.name}</h1>
            <div className="flex">
              <img className="h-8 aspect-square" src={trophy} alt="" />
              <h2>Points:{clan.points}</h2>
            </div>
          </div>
          <p className="text-custom-gray-text text-sm mb-2">
            {clan.description}
          </p>
          <div className=" flex bg-custom-black-4 rounded-2xl p-2 mt-2 box-border">
            <div className="w-1/2">
              <h3>Clan Location: {clan.clanlocation}</h3>
              <h3>Clan Languages:{clan.clanlanguage}</h3>
              <h3>Members: {clan.members?.length}/50</h3>
            </div>
            <div className="w-1/2">
              {" "}
              <h3>Type:{clan.open ? "Anyone can join" : "Closed"}</h3>
              <h3>Clan Level: 3</h3>
              <h3>Clan Category:{clan.category}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end h-[10vh] box-border p-2">
        <button
          onClick={() => {
            isJoined ? handleleaveclan(clan) : handleJoinClan(clan);
          }}
          className=" block cursor-pointer hover:bg-[#e6e6ff] hover:text-black  w-1/3 font-roboto bg-[#CCCCFF]  text-black   rounded-xl my-1 2xl:my-5 2xl:h-14"
        >
          {isJoined ? "Leave Clan" : "Join Clan"}
        </button>
      </div>
      <div className="h-1/2 overflow-scroll no-scrollbar p-5 ">
        {clan?.members?.map((member, index) => {
          return (
            <div
              key={member._id}
              className="flex items-center justify-between text-custom-gray-text mb-4 bg-custom-black-4 h-[16vh] w-full  p-5 "
            >
              <div className="flex  items-center bg-custom-black-2 w-2/3 gap-4 ">
                <h1 className="p-2">{index + 1}.</h1>
                <div
                  className={`border-box  p-2 flex justify-center items-center aspect-square`}
                >
                  <img
                    src={member.profilepicture || defaultuser}
                    className="h-12 aspect-square rounded-full "
                    alt="chess.com"
                  />
                </div>
                <div>
                  <h1 className="text-xl">{member.username}</h1>
                  <h5>{clan?.leader === member._id ? "Leader" : "Member"}</h5>
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <div className="flex items-center">
                  <img className="h-8 aspect-square" src={trophy} alt="" />
                  <h2>Points:2701</h2>
                </div>
                <button
                  onClick={() => {
                    navigate(`/profile/${member._id}`);
                  }}
                  className="text-white  bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-4 py-2"
                >
                  Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
