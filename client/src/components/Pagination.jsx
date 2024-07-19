import React from "react";

export default function Pagination({ totalPages, currentPage, setCurrenPage }) {
  return (
    <div>
      <nav className="inline-flex items-center p-1 rounded bg-twitter-black space-x-2 ">
        <button
          className="p-1 rounded border text-white bg-black hover:text-white hover:bg-blue-600 hover:border-blue-600"
          onClick={() => {
            setCurrenPage((prev) => prev - 1);
          }}
          disabled={currentPage === 1}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </button>
        <p className="text-white">
          Page {currentPage} of {totalPages}
        </p>
        <button
          className="p-1 rounded border text-white bg-black hover:text-white hover:bg-blue-600 hover:border-blue-600"
          disabled={currentPage === totalPages}
          onClick={() => {
            setCurrenPage((prev) => prev + 1);
          }}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}
