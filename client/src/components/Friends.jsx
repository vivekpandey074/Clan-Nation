import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SearchUserApi } from "../apis/users";
import { toast } from "react-toastify";
import defaultuserimage from "../assets/defaultuserimage.png";

export default function Friends() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchedUsernames, setFetchedUsernames] = useState([]);
  const { user } = useSelector((state) => state.users);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await SearchUserApi(query);
      setLoading(false);
      if (response.success) {
        setFetchedUsernames(response.users);
        setShowSearchResult(true);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setLoading(false);
      toast.error(
        err.message || "Something went wrong while fetching username",
        { position: "top-right" }
      );
    }
  };

  useEffect(() => {
    if (user && !query) {
      console.log(user.friends);
      setFetchedUsernames(user.friends);

      setShowSearchResult(false);
    }
  }, [user, query]);

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
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </div>
      <div>
        {fetchedUsernames?.length >= 1 ? (
          fetchedUsernames?.map((item) => {
            return (
              <div
                onClick={() => {
                  showSearchResult
                    ? navigate(`/profile/${item?._id}`)
                    : navigate(`/chat/personal/${item?._id}`);
                }}
                className={`flex gap-2 p-4 mb-5 h-20 cursor-pointer hover:scale-105 ease-out items-center gap-5 duration-300 hover:bg-black rounded-lg 
                 `}
                key={item?._id}
              >
                <img
                  src={item?.profilepicture || defaultuserimage}
                  alt="userimg"
                  className="aspect-square h-12 aspect-square rounded-full"
                />
                <div className="flex flex-col text-custom-gray-text  grow-[3]">
                  <h1 className="text-xl">{item?.username}</h1>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <h1 className="text-white">
              {showSearchResult
                ? `No user found for "${query}"`
                : "You have no friend currently :)"}
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
