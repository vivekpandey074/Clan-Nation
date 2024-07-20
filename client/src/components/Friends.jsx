import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import profliepic from "../assets/profilepic.jpeg";

export default function Friends() {
  const joinedclans = [{}];
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {};

  return (
    <>
      <div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto my-4">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search username"
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-4 py-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div>
        {joinedclans?.length >= 1 ? (
          joinedclans?.map((clan) => {
            return (
              <div
                onClick={() => {
                  navigate(`/chat/clan/${clan._id}`);
                }}
                className="flex gap-2 p-4 h-20 cursor-pointer hover:scale-105 ease-out duration-300 hover:bg-black rounded-lg  "
                key={clan._id}
              >
                <img
                  src={profliepic}
                  alt="clanimg"
                  className="aspect-square h-12 aspect-square rounded-full"
                />
                <div className="flex flex-col text-custom-gray-text  grow-[3]">
                  <h1 className="text-xl">Roughwork</h1>
                  <p className="text-sm">
                    this is the lastest message send by him
                  </p>
                  <p className="text-sm"></p>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <h1 className="text-white">No Notification for now</h1>
          </div>
        )}
      </div>
    </>
  );
}