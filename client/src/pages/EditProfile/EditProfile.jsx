import React, { useEffect, useRef, useState } from "react";
import defaultuserimage from "../../assets/defaultuserimage.png";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { toast } from "react-toastify";
import { SetUser } from "../../redux/userSlice";
import { UpdateProfileApi } from "../../apis/users";
import editbutton from "../../assets/editbutton.svg";
import defaultcover from "../../assets/cover.png";

const initialState = {
  username: "",
  bio: "",
  coverImg: "",
  profileImg: "",
};

const errorsText = {
  username: ` *username must be between 1-64 character with no consecutive ".". Only "+", "_" and "." special characters are allowed`,
  bio: "",
};

export default function EditProfile() {
  const { user } = useSelector((state) => state.users);
  const [form, setForm] = useState(initialState);
  const [coverImgPreview, setCoverImgPreview] = useState("");
  const [profileImgPreview, setProfileImgPreview] = useState("");
  const { username, bio } = form;
  const [error, setError] = useState(initialState);

  const profileRef = useRef(null);
  const coverRef = useRef(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (!e.target.checkValidity()) {
      setError({
        ...error,
        [e.target.name]: errorsText[e.target.name],
      });
    } else {
      setError({
        ...error,
        [e.target.name]: "",
      });
    }
  };

  const checkFileSize = (file) => {
    const maxSizeInBytes = 1 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.error("File size should not exceed 5MB");
      return true;
    }

    // Check file extension
    const validExtensions = ["jpg", "jpeg", "png", "gif"]; // Extendable list
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      toast.error("Unsupported file type");
      return true;
    }

    return false;
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (form.profileImg) {
      if (checkFileSize(form.profileImg)) return;
    }

    if (form.coverImg) {
      if (checkFileSize(form.coverImg)) return;
    }

    try {
      const formObj = new FormData();
      formObj.append("username", username);
      formObj.append("bio", bio);
      formObj.append("profileImg", form.profileImg);
      formObj.append("coverImg", form.coverImg);

      dispatch(SetLoader(true));
      const response = await UpdateProfileApi(user._id, formObj);
      dispatch(SetLoader(false));
      if (response.success) {
        toast.success("User updated successfully");
        dispatch(SetUser(response.updatedUser));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(
        err.message || "Something went wrong while  updating profile"
      );
    }
  };

  const handleChooseFile = (type) => {
    if (type === "Profile") {
      profileRef.current.click();
    } else if (type === "Cover") {
      coverRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.name === "profileImg") {
      setForm({
        ...form,
        profileImg: e.target.files[0],
      });
      setProfileImgPreview(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "coverImg") {
      setForm({
        ...form,
        coverImg: e.target.files[0],
      });
      setCoverImgPreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        bio: user.bio,
        profileImg: "",
        coverImg: "",
      });

      setProfileImgPreview(user?.profilepicture);

      setCoverImgPreview(user.coverImage);
    }
  }, [user]);

  return (
    <div className="h-full text-custom-gray-text ">
      <div className="w-full flex flex justify-center  items-center h-full  ">
        <form
          method="patch"
          onSubmit={handleUpdateUser}
          encType="multipart/form-data"
          className="flex flex-col   w-full h-full  overflow-y-scroll no-scrollbar "
        >
          <div
            className="w-full h-[30vh]  relative   bg-cover  bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${coverImgPreview || defaultcover})`,
            }}
          >
            <div
              className="rounded-full ms-5   absolute bottom-[-20vh] bg-no-repeat bg-center bg-cover h-[40vh] aspect-square  overflow-hidden"
              style={{
                backgroundImage: `url(${
                  profileImgPreview || defaultuserimage
                })`,
              }}
            >
              <div
                onClick={() => handleChooseFile("Profile")}
                className="absolute left-[20vh] top-[20vh] cursor-pointer"
              >
                <img src={editbutton} className="h-10" alt="" />
                <input
                  className="hidden"
                  type="file"
                  name="profileImg"
                  ref={profileRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div
              onClick={() => handleChooseFile("Cover")}
              className="absolute right-[10vh] bottom-[5vh] cursor-pointer"
            >
              <img src={editbutton} className="h-10" alt="" />
              <input
                className="hidden"
                type="file"
                name="coverImg"
                ref={coverRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex flex-col w-full h-[70vh]  items-center  bg-twitter-black overflow-y-scroll no-scrollbar">
            <div className="w-1/2 p-5 mt-[15vh] ">
              <div className=" flex flex-col gap-2">
                {" "}
                <label htmlFor="name" className="">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  required
                  autoComplete="false"
                  pattern="^(?!.*\.\.)(?!^\.)[a-zA-Z0-9._+]{1,64}(?<!\.)$"
                  onChange={handleChange}
                  className="bg-black w-full h-12 focus:outline-none p-2"
                />
                <p className="font-[400] font-Dmsans  text-sm text-[#FF0000]">
                  {error.username}
                </p>
              </div>

              <div className=" flex flex-col gap-2">
                <label htmlFor="bio">Bio:</label>
                <textarea
                  name="bio"
                  onChange={handleChange}
                  value={bio}
                  maxLength={100}
                  className="text resize-none w-full h-4/5 scrollable-element bg-black focus:outline-none p-2"
                />
              </div>
            </div>
            <div className="w-1/4">
              {" "}
              <button
                type="submit"
                className="text-white w-full mt-5 h-10 blue-gradient hover:blue-gradient focus:outline-none  focus:ring-4  font-medium rounded-lg text-sm px-5  text-center me-2 mb-2 "
              >
                Update
              </button>
            </div>
          </div>{" "}
        </form>
      </div>
    </div>
  );
}
