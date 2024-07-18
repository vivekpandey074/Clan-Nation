import React, { useState } from "react";
import "../index.css";
import crossbtn from "../assets/crossbtn.svg";
import { toast } from "react-toastify";
import { CodeforcesVerificationApi } from "../apis/users";

export default function ConnectionModal({ setShowModal }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCodeforcesVerification = async (username) => {
    try {
      setLoading(true);
      const response = await CodeforcesVerificationApi(username);
      setLoading(false);
      if (response.success) {
        toast.success(response.message, { position: "top-right" });
        setShowModal((prev) => !prev);
        window.location.reload();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Something went wrong while verifying", {
        position: "top-right",
      });
    }
  };
  return (
    <div className="h-full w-full border-2 left-0 top-0 fixed  flex justify-center items-center glassy">
      <div className="h-1/2 w-1/2  relative bg-twitter-black ">
        <img
          src={crossbtn}
          alt=""
          onClick={() => {
            setShowModal((prev) => !prev);
          }}
          className="absolute right-2 top-2 h-10 w-10 cursor-pointer"
        />
        <div className="w-full h-full p-4  text-custom-gray-text overflow-y-scroll no-scrollbar ">
          <h2 className="text-2xl">Instructions</h2>
          <ul className=" mt-2 flex flex-col gap-2">
            <li>
              {" "}
              1. First submit given problem on codeforces.com with your
              codeforces account.
              <a href="https://codeforces.com/problemset/problem/4/A">
                <span className="underline text-blue-300 ms-2">
                  PROBLEM- watermelon
                </span>
              </a>
            </li>
            <li> 2. Make sure submission is most recent one.</li>
          </ul>
          <div className=" flex flex-col gap-2 mt-10">
            {" "}
            <label htmlFor="name" className="">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              required
              autoComplete="false"
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black w-1/2 h-12 focus:outline-none p-2 "
            />
            <button
              onClick={() => handleCodeforcesVerification(username)}
              className="w-1/4 bg-black text-white p-2 hover:outline-1 hover:outline"
            >
              {loading ? "Connecting..." : "Connect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
