import React, { useEffect, useState } from "react";
import clan1 from "../assets/emblems/clanemblem6.png";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { JoinClanApi, LeaveClanApi, SearchClanApi } from "../apis/clans";
import { SetLoader } from "../redux/loaderSlice";
import { SetJoinedClans } from "../redux/joinedClansSlice";

export default function SearchClan() {
  const [query, setQuery] = useState("");
  const [clanList, setClanList] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { joinedclans } = useSelector((state) => state.joinedclans);

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

  const handleJoinClan = async (clan) => {
    try {
      dispatch(SetLoader(true));
      console.log(clan);
      const response = await JoinClanApi(clan, user);
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetJoinedClans([...joinedclans, clan]));
        handleSubmit();
        toast.success("Clan joined successfully");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Error while joining clan", {
        position: "top-right",
      });
    }
  };

  const handleleaveclan = async (clan) => {
    try {
      dispatch(SetLoader(true));
      const response = await LeaveClanApi(clan);
      dispatch(SetLoader(false));
      if (response.success) {
        handleSubmit();
        dispatch(SetJoinedClans(joinedclans.filter((x) => x._id !== clan._id)));
        toast.success("Clan leaved succesfully");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(
        err.message || "Error while leaving clan",

        { position: "top-right" }
      );
    }
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

      <div className="h-2/3 w-full  p-3 overflow-y-scroll flex flex-col bg-gray-600 gap-3 no-scrollbar ">
        {clanList.length === 0 ? (
          <>
            <div className="text-white">
              <h1>No clan found</h1>
            </div>
          </>
        ) : (
          clanList.map((clan) => {
            const checkjoin = clan.members.includes(user._id);

            return (
              <>
                <div className="flex gap-2 border-2 border-black glassy rounded-lg bg-[#BFC9CA] hover:bg-[#BFC9CA] p-4 h-[8vw] ">
                  <img
                    src={clan1}
                    alt="clanimg"
                    className="grow-[1] aspect-square h-50 w-10"
                  />
                  <div className="flex flex-col  grow-[3]">
                    <h1 className="text-xl">{clan.name}</h1>
                    <p className="text-sm">{clan.description}</p>
                    <p className="text-sm">Members: {clan.members.length}</p>
                  </div>
                  <div className="text-black flex flex-col  gap-2">
                    <h1 className="text-sm">Points: {clan.points}</h1>
                    <button
                      type="submit"
                      onClick={(e) => {
                        checkjoin
                          ? handleleaveclan(clan)
                          : handleJoinClan(clan);
                      }}
                      className="text-white  bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-4 py-2"
                    >
                      {checkjoin ? "Leave Clan" : "Join Clan"}
                    </button>
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
