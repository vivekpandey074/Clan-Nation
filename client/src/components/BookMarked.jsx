import React from "react";
import crossbtn from "../assets/crossbtn.svg";
import { useDispatch, useSelector } from "react-redux";
import { SetClanBookmarks } from "../redux/bookmarksSlice";
import { useNavigate } from "react-router-dom";

export default function BookMarked() {
  const { clanBookmarks } = useSelector((state) => state.clanBookmarks);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRemoveBookmark = async (clan) => {
    dispatch(
      SetClanBookmarks(clanBookmarks.filter((item) => item._id !== clan._id))
    );
  };

  return (
    <>
      <div className="relative p-10 flex flex-wrap h-4/5 w-full  gap-5">
        {clanBookmarks.length >= 1 ? (
          clanBookmarks.map((item) => {
            return (
              <>
                {" "}
                <div className=" relative h-[25vh] w-1/3 p-6  bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
                  <div
                    onClick={() => navigate(`/clan/${item._id}`)}
                    className="cursor-pointer flex items-center"
                  >
                    <span className="text-xl">⚔️</span>
                    <h3 className="my-2 ml-3 text-lg font-bold text-gray-800 dark:text-white">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                  <img
                    src={crossbtn}
                    onClick={() => handleRemoveBookmark(item)}
                    className="h-6 cursor-pointer w-6 absolute right-2 top-1 "
                    alt=""
                  />
                </div>
              </>
            );
          })
        ) : (
          <>No Bookmarks !!</>
        )}
      </div>
    </>
  );
}
