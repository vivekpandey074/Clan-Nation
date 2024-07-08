import React from "react";
import { useSelector } from "react-redux";
import profilepic from "../assets/defaultuserimage.png";
export default function Message({ message }) {
  return (
    <div className="text-custom-gray-text bt-2 bb-2 flex gap-2 ">
      <img
        src={
          message.sender.profilepicture === ""
            ? profilepic
            : message.sender.profilepicture
        }
        className="h-10 aspect-square rounded-full m-2"
        alt=""
      />

      <p className="p-2">{message.sender.username}</p>
      <p className="p-2">{message.content}</p>
    </div>
  );
}
