import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SetLoader } from "../redux/loaderSlice";
import { GetCurrentUser } from "../apis/users";
import { SetUser } from "../redux/userSlice";

export default function ProtectedPage({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Error occured while validating user.", {
        position: "top-right",
      });
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      toast.info("Please Login to continue", {
        position: "top-right",
      });
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  return children;
}
