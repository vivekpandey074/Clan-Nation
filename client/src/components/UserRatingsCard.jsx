import React from "react";
import { useSelector } from "react-redux";

const obj = {
  CHESS: "chess_account",
  CODEFORCES: "codeforces_account",
  GENERAL: "general_account",
};

export default function UserRatingsCard({
  type,
  typeimg,
  codeforces_account,
  chess_account,
  general_account,
}) {
  const URLs = {
    CHESS: "",
    CODEFORCES: `https://codeforces.com/profile/`,
    GENERAL: "",
  };
  const { user } = useSelector((state) => state.users);
  return (
    <div className=" px-6 py-6 h-4/5 text-center bg-gray-800 rounded-lg lg:mt-0 xl:px-10">
      <div className="space-y-4 xl:space-y-6">
        <img
          className="mx-auto rounded-full h-24 w-24"
          src={typeimg}
          alt="author avatar"
        />
        <div className="space-y-2">
          <div className="flex justify-center items-center flex-col space-y-3 text-lg font-medium leading-6">
            <h3 className="text-white">
              {user?.[obj[type]] ? (
                <a href={URLs[type] + codeforces_account}>
                  {user?.[obj[type]]}{" "}
                </a>
              ) : (
                "Not Connected"
              )}
            </h3>
            <p className="text-indigo-300">{type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
