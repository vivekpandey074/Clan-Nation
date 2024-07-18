import React, { useEffect, useState } from "react";
import modernclan1 from "../assets/emblems/modernclan1.jpeg";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { JoinClanApi, LeaveClanApi, SearchClanApi } from "../apis/clans";
import { SetLoader } from "../redux/loaderSlice";
import { SetJoinedClans } from "../redux/joinedClansSlice";
import trophy from "../assets/trophy2.svg";
import { useNavigate } from "react-router-dom";
import { SetClanBookmarks } from "../redux/bookmarksSlice";
export default function SearchClan() {
  const [query, setQuery] = useState("");
  const [clanList, setClanList] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const navigate = useNavigate();
  const { clanBookmarks } = useSelector((state) => state.clanBookmarks);

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      dispatch(SetLoader(true));
      const response = await SearchClanApi(query);
      dispatch(SetLoader(false));
      if (response.success) {
        setClanList(() => response.clans);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Error while fetching clans", {
        position: "top-right",
      });
    }
  };

  const handleAddBookmark = async (clan) => {
    dispatch(SetClanBookmarks([...clanBookmarks, clan]));
  };

  const handleRemoveBookmark = async (clan) => {
    dispatch(
      SetClanBookmarks(clanBookmarks.filter((item) => item._id !== clan._id))
    );
  };

  const check = (bookmarks, clan) => {
    if (!bookmarks || !clan) return false;

    for (let index = 0; index < bookmarks.length; index++) {
      if (bookmarks[index]._id === clan._id) return true;
    }

    return false;
  };

  return (
    <>
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
            placeholder="Search for your favourite clan..."
            required
          />
          <button
            type="submit"
            disabled={query.trim() === ""}
            className="text-white absolute end-2.5 bottom-2.5 bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>

      <div className="h-2/3 w-full  p-3 overflow-y-scroll flex flex-col bg-gray-600 gap-3 no-scrollbar p-5 ">
        {clanList.length === 0 ? (
          <>
            <div className="text-white">
              <h1>No clan found</h1>
            </div>
          </>
        ) : (
          clanList.map((clan) => {
            return (
              <>
                <div className="flex gap-2  border-black glassy rounded-lg bg-[#BFC9CA] hover:scale-105 ease-out duration-300 hover:bg-[#BFC9CA] p-4 h-[16vh] ">
                  <div className="h-full flex-1  flex justify-center">
                    <img
                      src={modernclan1}
                      alt="clanimg"
                      className=" rounded-full aspect-square h-full"
                    />
                  </div>
                  <div className="flex flex-col text-black font-[600] flex-[3] ">
                    <h1 className="text-xl font-bold">{clan.name}</h1>
                    <p className="text-sm ">{clan.description}</p>
                    <p className="text-sm">Members: {clan.members.length}</p>
                  </div>
                  <div className="text-black flex flex-col   gap-2  flex-[2] ">
                    <div className="flex items-center justify-center ">
                      <img className="h-8 aspect-square" src={trophy} alt="" />
                      <h2 className="font-bold">Points: 2701</h2>
                    </div>
                    <div className="flex justify-around">
                      <button
                        type="submit"
                        onClick={() => {
                          navigate(`/clan/${clan._id}`);
                        }}
                        className="text-white  bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-4 py-2"
                      >
                        View clan
                      </button>
                      <button
                        type="submit"
                        onClick={() => {
                          if (!check(clanBookmarks, clan)) {
                            handleAddBookmark(clan);
                          } else {
                            handleRemoveBookmark(clan);
                          }
                        }}
                        className="text-white  bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-4 py-2"
                      >
                        {" "}
                        {check(clanBookmarks, clan) ? "Unmark" : "Bookmark"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          })
        )}
      </div>
    </>
  );
}
