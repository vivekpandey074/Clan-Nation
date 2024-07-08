import React, { useEffect, useState } from "react";
import addfileicon from "../../assets/addfileicon.svg";
import smileemoji from "../../assets/smileemoji.svg";
import sendbtn from "../../assets/sendbtn.svg";
import Message from "../../components/Message";
import "../../index.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { toast } from "react-toastify";
import {
  GetClanDetailsApi,
  GetClanMessagesApi,
  SendMessageApi,
} from "../../apis/clans";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

export default function GroupChat() {
  const { clanId } = useParams();
  const [clan, setClan] = useState({});
  const [allmessage, setAllMessages] = useState([]);
  const dispatch = useDispatch();
  const [content, SetContent] = useState("");
  const { user } = useSelector((state) => state.users);

  const [socketConnected, setSocketConnected] = useState(false);

  const getClanDetails = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetClanDetailsApi(clanId);
      dispatch(SetLoader(false));
      if (response.success) {
        setClan(() => response.clan);
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

  const getClanMessages = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetClanMessagesApi(clanId);
      dispatch(SetLoader(false));
      if (response.success) {
        setAllMessages(() => response.messages);
        socket.emit("join-chat", clanId);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Could not fetch clan messages", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    //i am using if (user) here, because user is initially empty and useEffect run first then redux value get populated.and user is initally run, that it is also there in dependecny array. for now i dont know solution.
    // One more thing- useSelector will trigger re-rendering on getting new value of user.
    // https://www.reddit.com/r/reactjs/comments/ltug1j/does_redux_state_populate_after_useeffect/

    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);

      socket.on("connect", () => {
        setSocketConnected(true);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getClanDetails();
      getClanMessages();
    }

    selectedChatCompare = clanId;
  }, [clanId, user]);

  useEffect(() => {
    socket?.on("message-received", (newmessage) => {
      if (!selectedChatCompare || selectedChatCompare !== newmessage.clan) {
        //give notification
        console.log("here");
      } else {
        console.log(newmessage);
        setAllMessages([...allmessage, newmessage]);
      }
    });
  });

  const SendMessage = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await SendMessageApi(content, clanId);
      dispatch(SetLoader(false));
      if (response.success) {
        SetContent("");
        console.log(socket);
        setAllMessages([...allmessage, response.newmessage]);
        socket.emit("new-message", response.newmessage, clan);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Couldn't send message", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="text-custom-gray-text h-full w-full border-box flex flex-col">
      <div className="h-[10vh]  flex items-center justify-center p-2 bg-custom-black-4">
        <h1 className="text-3xl Bevan-font">{clan?.name}</h1>
      </div>
      <div className="h-[65vh]  w-full p-5 overflow-y-scroll scrollable-element pt-[5vh]">
        {allmessage?.length >= 1 ? (
          allmessage.map((message) => <Message message={message} />)
        ) : (
          <>
            <div>
              <h1>clan does not have any message.</h1>
            </div>
          </>
        )}
      </div>
      <div className="h-[25vh]  w-full flex justify-center items-center p-2">
        <div className="w-full bg-custom-black-2 border-box flex  h-full items-center  p-2 ">
          <textarea
            name="content"
            id="content"
            onChange={(e) => SetContent(e.target.value)}
            value={content}
            className="text resize-none w-4/5 h-4/5 scrollable-element bg-custom-black-4 focus:outline-none p-2"
          />
          <div className="flex gap-5 justify-center w-1/5 ">
            <img
              className="aspect-square h-8 cursor-pointer "
              src={sendbtn}
              onClick={SendMessage}
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
