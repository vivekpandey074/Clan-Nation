import React from "react";

export default function BookMarked() {
  return (
    <>
      <div className="p-10 flex flex-wrap h-4/5 w-full  gap-5">
        <div className="h-[20vh] p-6 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
          <div className="flex items-center">
            <span className="text-xl">⚔️</span>
            <h3 className="my-2 ml-3 text-lg font-bold text-gray-800 dark:text-white">
              Dark Invaders
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            This is the short description of your feature.
          </p>
        </div>
        <div className="h-[20vh] p-6 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
          <div className="flex items-center">
            <span className="text-xl">⚔️</span>
            <h3 className="my-2 ml-3 text-lg font-bold text-gray-800 dark:text-white">
              Dark Invaders
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            This is the short description of your feature.
          </p>
        </div>
      </div>
    </>
  );
}
