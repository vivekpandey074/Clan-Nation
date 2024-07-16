import React, { useEffect, useState } from "react";

import profilepic from "../../assets/profilepic.jpeg";
import UserRatingsCard from "../../components/UserRatingsCard";
import "../../index.css";
import defaultuser from "../../assets/defaultuserimage.png";
import defaultcover from "../../assets/cover.png";
import chess from "../../assets/chesscom.svg";
import codeforces from "../../assets/codeforces.svg";
import GeneralClan from "../../assets/GeneralClan.svg";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { toast } from "react-toastify";
import { GetProfileApi } from "../../apis/users";

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({});

  const getProfileDetails = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProfileApi(id);
      dispatch(SetLoader(false));
      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(
        err.message || "Something went wrong while fetching user profile.",
        {
          position: "top-right",
        }
      );
    }
  };

  useEffect(() => {
    getProfileDetails(id);
  }, []);

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
        <div className="text-custom-gray-text  w-7/12 h-[25vh] ms-[50vh] p-5">
          <h1 className="text-5xl mb-5">@{profile.username}</h1>
          <p>{profile.bio}</p>
        </div>
        <div className=" w-full h-[40vh] flex overflow-scroll no-scrollbar justify-evenly items-center">
          <UserRatingsCard typeimg={chess} />
          <UserRatingsCard typeimg={codeforces} />
          <UserRatingsCard typeimg={GeneralClan} />
        </div>
      </div>
    </div>
  );
}
