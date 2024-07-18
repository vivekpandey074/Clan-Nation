import { axiosInstance } from "./axiosInstance";

export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user");
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const GetProfileApi = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/users/profile/${id}`);

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const UpdateProfileApi = async (id, form) => {
  try {
    const response = await axiosInstance.patch(`/api/users/update/${id}`, form);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const CodeforcesVerificationApi = async (username) => {
  try {
    console.log(username);
    const response = await axiosInstance.post(`/api/users/verify-codeforces`, {
      username,
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
