import React from "react";
import { useSelector } from "react-redux";
import profilepic from "../assets/defaultuserimage.png";
import { useNavigate } from "react-router-dom";

const options = {
  year: "numeric", // e.g., 2024
  month: "long", // e.g., April
  day: "numeric", // e.g., 26
  hour: "2-digit", // e.g., 07 AM/PM based on locale
  minute: "2-digit", // e.g., 44
};
export default function Message({ message }) {
  const navigate = useNavigate();
  return (
    <div className="text-custom-gray-text bg-custom-black-2 mt-2 bt-2 bb-2 p-3">
      <div className="flex relative">
        <img
          src={
            message.sender.profilepicture === ""
              ? profilepic
              : message.sender.profilepicture
          }
          className="h-10 aspect-square rounded-full m-2"
          alt=""
        />

        <p
          className="p-2 text-md cursor-pointer"
          onClick={() => navigate(`/profile/${message.sender._id}`)}
        >
          {message.sender.username}
        </p>
        <p className="absolute right-0 text-sm ">
          {new Date(message?.createdAt).toLocaleDateString("en-US", options)}
        </p>
      </div>
      <div>
        <p className="p-2 text-md">{message.content}</p>
      </div>
    </div>
  );
}
