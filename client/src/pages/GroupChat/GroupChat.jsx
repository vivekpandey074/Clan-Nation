import React, { useEffect, useRef, useState } from "react";
import addfileicon from "../../assets/addfileicon.svg";
import smileemoji from "../../assets/smileemoji.svg";
import sendbtn from "../../assets/sendbtn.svg";
import Message from "../../components/Message";
import modernclan1 from "../../assets/emblems/modernclan1.jpeg";
import verticaloptions from "../../assets/verticaloptions.svg";
import "../../index.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const fetchMoreData = async () => {
    console.log("hellow");
    try {
      const response = await GetClanMessagesApi(clanId, currentPage);
      if (response.success) {
        setAllMessages((prev) => [...response.messages, ...prev]);

        if (response.totalPages <= currentPage) setHasMore(false);
        else setHasMore(true);

        setCurrentPage((prev) => prev + 1);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast.error(err.message || "Error occurred while fetching messages");
    }
  };

  const getClanMessages = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetClanMessagesApi(clanId, 1);
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
      setCurrentPage(2);
      setHasMore(true);
    }

    selectedChatCompare = clanId;
  }, [clanId, user]);

  useEffect(() => {
    socket?.on("message-received", (newmessage) => {
      if (!selectedChatCompare || selectedChatCompare !== newmessage.clan) {
        //give notification
      } else {
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
      <div className="h-[15vh] relative flex items-center justify-start gap-2 p-2 bg-custom-black-4">
        <div className="border-box   p-2 flex justify-center items-center aspect-square">
          <img
            src={modernclan1}
            className="h-20 aspect-square rounded-full "
            alt="chess.com"
          />
        </div>
        <h1
          onClick={() => {
            navigate(`/clan/${clan._id}`);
          }}
          className="text-3xl Bevan-font cursor-pointer"
        >
          {clan?.name}
        </h1>
        <div
          className="absolute right-10"
          onClick={() => setShowOptionsMenu((prev) => !prev)}
        >
          <img src={verticaloptions} className="h-6" alt="" />
        </div>
      </div>
      {showOptionsMenu ? (
        <div className="absolute right-10 mt-20 p-5 w-[20vh] duration-300 bg-black ease-out rounded-lg z-[100]">
          <ul className="flex flex-col gap-5 cursor-pointer">
            <li>Leave Clan</li>
            <li>Report</li>
          </ul>
        </div>
      ) : (
        <></>
      )}

      <div
        id="scrollable-div"
        className="h-[65vh]   flex flex-col-reverse w-full  p-5 overflow-y-scroll scrollable-element pt-[5vh]"
      >
        <InfiniteScroll
          dataLength={allmessage?.length}
          next={fetchMoreData}
          hasMore={hasMore}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          loader={
            <div className="flex justify-center">
              <h4 className="text-white">Loading...</h4>
            </div>
          }
          scrollableTarget="scrollable-div"
          inverse={true}
        >
          {allmessage?.length >= 1 ? (
            allmessage
              .toReversed()
              .map((message) => (
                <Message message={message} Leader={clan?.leader} />
              ))
          ) : (
            <>
              <div>
                <h1>clan does not have any message.</h1>
              </div>
            </>
          )}
        </InfiniteScroll>
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
