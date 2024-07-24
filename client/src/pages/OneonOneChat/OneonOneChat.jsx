import { useContext, useEffect, useState } from "react";
import addfileicon from "../../assets/addfileicon.svg";
import smileemoji from "../../assets/smileemoji.svg";
import sendbtn from "../../assets/sendbtn.svg";
import Message from "../../components/Message";
import defaultpicture from "../../assets/defaultuserimage.png";
import modernclan1 from "../../assets/emblems/modernclan1.jpeg";
import verticaloptions from "../../assets/verticaloptions.svg";
import "../../index.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
// import { io } from "socket.io-client";
import { SocketContext } from "../../socket";
import {
  GetPersonalMessagesApi,
  GetProfileApi,
  SendPersonalMessageApi,
} from "../../apis/users";

// const ENDPOINT = "http://localhost:5000";
// var socket;

var selectedChatCompare;

export default function OneonOneChat() {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [allmessage, setAllMessages] = useState([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, SetContent] = useState("");
  const { user } = useSelector((state) => state.users);
  const [roomID, setRoomID] = useState("");

  const getProfileDetails = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProfileApi(id);
      dispatch(SetLoader(false));
      if (response.success) {
        setProfile(() => response.data);
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

  const fetchMoreData = async () => {
    try {
      const response = await GetPersonalMessagesApi(id, currentPage);
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

  const getPersonalMessages = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetPersonalMessagesApi(id, 1);
      dispatch(SetLoader(false));
      if (response.success) {
        setAllMessages(() => response.messages);
        if (response?.messages?.length === 0) setHasMore(false);
        let room;

        if (user?._id < id) {
          room = `${user?._id}-${id}`;
        } else {
          room = `${id}-${user?._id}`;
        }

        setRoomID(() => room);

        socket.emit("join-chat", room);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));

      toast.error(err.message || "Could not fetch personal messages", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (user) {
      getProfileDetails(id);
      getPersonalMessages();
      setCurrentPage(2);
      setHasMore(true);
    }

    selectedChatCompare = id;
  }, [id, user]);

  useEffect(() => {
    socket?.on("message-received", (newmessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare !== newmessage.sender?._id
      ) {
        //give notification
        console.log("hi");
      } else {
        setAllMessages([...allmessage, newmessage]);
      }
    });
  });

  const SendMessage = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await SendPersonalMessageApi(content, id);
      dispatch(SetLoader(false));
      if (response.success) {
        SetContent("");

        setAllMessages([...allmessage, response.newmessage]);
        socket.emit("new-message", response.newmessage, undefined, id, roomID);
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
            src={profile?.profilepicture || defaultpicture}
            className="h-20 aspect-square rounded-full "
            alt="chess.com"
          />
        </div>
        <h1
          onClick={() => {
            navigate(`/profile/${profile._id}`);
          }}
          className="text-3xl Bevan-font cursor-pointer"
        >
          {profile?.username}
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
              .map((message) => <Message message={message} Leader={false} />)
          ) : (
            <>
              <div className="flex justify-center">
                <h1>Send some message to start chatting</h1>
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
