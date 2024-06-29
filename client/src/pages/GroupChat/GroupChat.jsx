import React from "react";
import addfileicon from "../../assets/addfileicon.svg";
import smileemoji from "../../assets/smileemoji.svg";
import sendbtn from "../../assets/sendbtn.svg";
import Message from "../../components/Message";
import "../../index.css";

export default function GroupChat() {
  return (
    <div className="text-custom-gray-text h-full w-[67vw] border-box flex flex-col">
      <div className="h-[10vh]  flex items-center p-2 bg-custom-black-4">
        <h1 className="text-3xl Bevan-font">#DARK INVADERS</h1>
      </div>
      <div className="h-[65vh]  w-full p-5 overflow-y-scroll scrollable-element pt-[5vh]">
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
      <div className="h-[25vh]  w-full flex justify-center items-center p-2">
        <div className="w-full bg-custom-black-2 border-box flex  h-full items-center  p-2 ">
          <textarea className="text resize-none w-4/5 h-4/5 scrollable-element bg-custom-black-4 focus:outline-none p-2" />
          <div className="flex gap-5 justify-center w-1/5 ">
            <img
              className="aspect-square h-8 cursor-pointer "
              src={sendbtn}
              alt="Send Msg"
            />
            <img
              className="h-10 aspect-square cursor-pointer"
              src={addfileicon}
              alt="Add file B"
            />
            <img
              className="aspect-square h-10 cursor-pointer"
              src={smileemoji}
              alt="add file icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
