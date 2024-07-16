import React from "react";

export default function UserRatingsCard({ typeimg }) {
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
            <h3 className="text-white">@username</h3>
            <p className="text-indigo-300">Chess Ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
