import React, { useState } from "react";
import CountryOptions from "../../components/CountryOptions";
import LanguageOptions from "../../components/LanguageOptions";
import { toast } from "react-toastify";
import { CreateClanApi } from "../../apis/clans";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { SetJoinedClans } from "../../redux/joinedClansSlice";

const initialState = {
  name: "",
  description: "",
  clanlanguage: "",
  clanlocation: "",
  open: true,
};

export default function CreateClan() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(initialState);
  const { name, description, clanlanguage, clanlocation, open } = form;
  const dispatch = useDispatch();
  const { clanCategory } = useSelector((state) => state.clanCategories);
  const { joinedclans } = useSelector((state) => state.joinedclans);

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setForm(() => ({ ...form, [e.target.name]: e.target.checked }));
    } else {
      setForm(() => ({ ...form, [e.target.name]: e.target.value }));
    }

    if (e.target.name === "name") {
      if (!e.target.checkValidity()) {
        setError(() => ({
          ...error,
          name: "*Clan name must have alphabets only and at max 1 space in between with length of max 3-25",
        }));
      } else {
        setError(() => ({
          ...error,
          name: "",
        }));
      }
    }
  };
  const handleCreateClan = async (e) => {
    e.preventDefault();
    try {
      dispatch(SetLoader(true));
      const response = await CreateClanApi({ ...form, category: clanCategory });
      dispatch(SetLoader(false));

      if (response.success) {
        toast.success(response.message);
        dispatch(SetJoinedClans([...joinedclans, response.clan]));
        setForm(() => initialState);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(
        err.message ||
          "Error occured while creating the clan. Try again after some time",
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="h-full text-custom-gray-text ">
      <div className="h-[10vh]  flex items-center justify-center p-2 bg-custom-black-4 ">
        <h1 className="text-3xl Bevan-font ">CREATE CLAN</h1>
      </div>
      <div className="w-full flex flex justify-center items-center h-[90vh]  ">
        <form
          method="post"
          onSubmit={handleCreateClan}
          className="flex flex-col w-2/3 gap-5 h-[9/10] overflow-y-scroll no-scrollbar "
        >
          <div className=" flex flex-col gap-2">
            {" "}
            <label htmlFor="name" className="">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              required
              autoComplete="false"
              pattern="[A-Za-z]{3,25}( [A-Za-z]{1,25})?$"
              onChange={handleChange}
              className="bg-black w-full h-12 focus:outline-none p-2"
            />
            <p className="font-[400] font-Dmsans  text-sm text-[#FF0000]">
              {error.name}
            </p>
          </div>

          <div className=" flex flex-col gap-2">
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={description}
              className="text resize-none w-full h-4/5 scrollable-element bg-black focus:outline-none p-2"
            />
          </div>

          <div className=" flex flex-col gap-2">
            <label htmlFor="clanlanguage">Clan Language:</label>
            <LanguageOptions
              handleChange={handleChange}
              clanlanguage={clanlanguage}
            />
          </div>
          <div className=" flex flex-col gap-2">
            <label htmlFor="clanlocation">Clan Location:</label>
            <CountryOptions
              handleChange={handleChange}
              clanlocation={clanlocation}
            />
          </div>
          <div className=" flex flex-col gap-2">
            <label className=" font-[400] ">
              <input
                type="checkbox"
                name="open"
                onChange={handleChange}
                checked={open}
                className="inline-block"
              />{" "}
              Anyone can join
            </label>
          </div>

          <button
            type="submit"
            className="text-white w-1/2 h-10 blue-gradient hover:blue-gradient focus:outline-none  focus:ring-4  font-medium rounded-lg text-sm px-5  text-center me-2 mb-2 "
          >
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
}
