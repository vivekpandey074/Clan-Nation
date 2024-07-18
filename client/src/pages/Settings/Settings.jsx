import React, { useState } from "react";
import ConnectionModal from "../../components/ConnectionModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user } = useSelector((state) => state.users);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className=" h-full text-custom-gray-text ">
        <div className="h-[10vh]  flex items-center justify-center p-2 bg-custom-black-4 ">
          <h1 className="text-3xl Bevan-font ">SETTINGS</h1>
        </div>
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <div className="flex w-full p-5 justify-between  items-center">
            <p className="text-xl  text-custom-gray-text">
              Connect your account to codeforces
            </p>
            <button
              onClick={() => setShowModal((prev) => !prev)}
              disabled={user?.codeforces_account}
              className="bg-sky-400 rounded-lg text-xl text-white w-[20vw] p-2 "
            >
              {user?.codeforces_account ? "Connected" : "Verify"}
            </button>
          </div>
          <div className="flex w-full p-5 justify-between items-center  ">
            <p className="text-xl  text-custom-gray-text">Logout</p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-black rounded-lg text-xl text-white w-[20vw] p-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {showModal ? <ConnectionModal setShowModal={setShowModal} /> : <></>}
    </>
  );
}
