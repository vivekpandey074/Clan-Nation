import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../index.css";
export default function FindClan() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  return (
    <div className="h-full text-custom-gray-text ">
      <div className="h-[10vh]  flex items-center justify-center p-2 bg-custom-black-4 ">
        <h1 className="text-3xl Bevan-font ">FIND CLAN</h1>
      </div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px  justify-center">
          <li
            onClick={() => {
              navigate("/findclan");
              setTab(1);
            }}
            className={` w-1/2 ${
              tab === 1 ? "bg-violet-300 rounded-full text-white" : ""
            }  cursor-pointer `}
          >
            <div className=" p-4   rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
              SEARCH
            </div>
          </li>
          <li
            onClick={() => {
              navigate("/findclan/bookmarks");
              setTab(2);
            }}
            className={` w-1/2 ${
              tab === 2 ? "bg-violet-300  rounded-full" : ""
            }  cursor-pointer `}
          >
            <div className="inline-block p-4 text-white  rounded-t-lg active ">
              BOOKMARKS
            </div>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}
