import React, { useContext, useEffect, useState } from "react";

import profilepic from "../../assets/profilepic.jpeg";
import UserRatingsCard from "../../components/UserRatingsCard";
import "../../index.css";
import defaultuser from "../../assets/defaultuserimage.png";
import defaultcover from "../../assets/cover.png";
import chess from "../../assets/chesscom.svg";
import codeforces from "../../assets/codeforces.svg";
import GeneralClan from "../../assets/GeneralClan.svg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { toast } from "react-toastify";
import { GetProfileApi, SendRequestApi, UnfriendApi } from "../../apis/users";
import addfriend from "../../assets/addfriend.svg";
import unfriend from "../../assets/unfriend.svg";
import pending from "../../assets/pending.svg";
import { CheckFriendShipStatus } from "../../apis/users";
import { REFETCH_PROFILE } from "../../constants/events";
import { SocketContext } from "../../socket";

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState({});
  const socket = useContext(SocketContext);

  const getProfileDetails = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProfileApi(id);
      dispatch(SetLoader(false));
      if (response.success) {
        setProfile(response.data);
        checkFriendShipStatus(response.data._id);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(
        err.message || "Something went wrong while fetching user profile",
        {
          position: "top-right",
        }
      );
    }
  };

  const handleSendRequest = async (receiverID) => {
    try {
      const response = await SendRequestApi(receiverID);
      if (response.success) {
        toast.success(response.message);

        if (profile) checkFriendShipStatus(profile._id);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong while sending request", {
        position: "top-right",
      });
    }
  };

  const checkFriendShipStatus = async (friendID) => {
    try {
      const response = await CheckFriendShipStatus(friendID);
      if (response.success) {
        setStatus(response.friendStatus);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast.error(
        err.message || "Something went wrong while fetching friendship status",
        { position: "top-right" }
      );
    }
  };

  const handleRemoveFriend = async (friendID) => {
    try {
      dispatch(SetLoader(true));
      const response = await UnfriendApi(friendID);
      dispatch(SetLoader(false));
      if (response.success) {
        toast.success(response);
        if (profile) checkFriendShipStatus(profile._id);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Something went wrong while removing friend", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (user) {
      getProfileDetails(id);
    }
  }, [id, user]);

  useEffect(() => {
    socket?.on(REFETCH_PROFILE, () => {
      if (user) {
        getProfileDetails(id);
      }
    });
  });

  return (
    <div className="bg-black h-full w-full">
      <div
        className="w-full h-[30vh] relative  bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${profile.coverImage || defaultcover})`,
        }}
      >
        <div
          className="rounded-full ms-5   absolute bottom-[-20vh] bg-no-repeat bg-center bg-cover h-[40vh] aspect-square  overflow-hidden"
          style={{
            backgroundImage: `url(${profile.profilepicture || defaultuser})`,
          }}
        ></div>
      </div>
      <div className="w-full h-[70vh] ">
        <div className="text-custom-gray-text   w-7/12 h-[25vh] ms-[50vh] p-5">
          <div className="flex  items-center justify-between">
            {" "}
            <h1 className="text-5xl mb-5">@{profile.username}</h1>{" "}
            <img
              src={
                status === "friend"
                  ? unfriend
                  : status === "pending"
                  ? pending
                  : addfriend
              }
              alt=""
              onClick={
                status === "friend"
                  ? () => {
                      handleRemoveFriend(profile?._id);
                    }
                  : status === "pending"
                  ? () => {}
                  : () => {
                      handleSendRequest(profile?._id);
                    }
              }
              className={`h-10 hover:scale-110 duration-300 cursor-pointer aspect-square rounded-full ${
                user?._id === profile?._id ? "invisible" : ""
              }`}
            />
          </div>
          <p>{profile.bio}</p>
        </div>
        <div className=" w-full h-[40vh] flex overflow-scroll no-scrollbar justify-evenly items-center">
          <UserRatingsCard
            type={"CHESS"}
            typeimg={chess}
            chess_account={profile?.chess_account}
          />
          <UserRatingsCard
            type={"CODEFORCES"}
            typeimg={codeforces}
            codeforces_account={profile?.codeforces_account}
          />
          <UserRatingsCard
            type={"GENERAL"}
            typeimg={GeneralClan}
            general_account={profile?.general_account}
          />
        </div>
      </div>
    </div>
  );
}
