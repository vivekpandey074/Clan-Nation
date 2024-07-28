import React, { useContext, useEffect, useState } from "react";
import { AcceptRequestApi, GetNotificationsApi } from "../apis/users";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../socket";
import { NEW_REQUEST, REFETCH_NOTIFICATIONS } from "../constants/events";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/userSlice";
export default function Notifications() {
  const [allNotification, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countNotification, setNotifications] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = useContext(SocketContext);
  const handleGetAllNotifications = async () => {
    try {
      setLoading(true);
      const response = await GetNotificationsApi();
      setLoading(false);
      if (response.success) {
        setAllNotifications(response.notifications);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setLoading(false);
      toast.error(
        err.message || "Something went wrong while fetching notifcations",
        { position: "top-right" }
      );
    }
  };

  const handleAcceptRequest = async (requestID, accept) => {
    try {
      setLoading(true);
      const response = await AcceptRequestApi(requestID, accept);
      setLoading(false);
      if (response.success) {
        toast.success(response.message);
        handleGetAllNotifications();
        if (accept) dispatch(SetUser(response.updatedUser));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setLoading(false);
      toast.error(
        err.message || "Something went wrong while accepting request",
        { position: "top-right" }
      );
    }
  };
  useEffect(() => {
    handleGetAllNotifications();
  }, []);

  useEffect(() => {
    socket?.on(NEW_REQUEST, () => {
      handleGetAllNotifications();
    });

    // socket?.on(REFETCH_NOTIFICATIONS, () => {
    //   handleGetAllNotifications();
    // });
  });

  return (
    <div className="-300 h-full  flex flex-col gap-10 overflow-y-scroll  no-scrollbar p-2">
      {loading ? (
        <h3 className="text-custom-gray-text"> Loading...</h3>
      ) : allNotification.length < 1 ? (
        <h3 className="text-custom-gray-text">No request for now</h3>
      ) : (
        allNotification.map((request) => {
          return (
            <div
              key={request._id}
              className="flex flex-col text-custom-gray-text gap-5 p-4 cursor-pointer bg-custom-black-4 ease-out duration-300 hover:bg-black rounded-lg  "
            >
              <h1 className="text-xl text-white">
                <span
                  onClick={() => {
                    navigate(`/profile/${request.sender?._id}`);
                  }}
                >
                  {" "}
                  ⚔️ {request?.sender?.username}{" "}
                </span>
                <span className="text-sm text-custom-gray-text">
                  {" "}
                  sent you friend request
                </span>
              </h1>
              <div className="flex items-center justify-evenly">
                <button
                  className="bg-green-500 text-white rounded-md w-1/3"
                  onClick={() => {
                    handleAcceptRequest(request._id, true);
                  }}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white rounded-md w-1/3"
                  onClick={() => {
                    handleAcceptRequest(request._id, false);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
