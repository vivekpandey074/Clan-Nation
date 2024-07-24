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
    return err.response.data || err.message;
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
    const response = await axiosInstance.post(`/api/users/verify-codeforces`, {
      username,
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const SearchUserApi = async (query) => {
  try {
    const response = await axiosInstance.get(
      `/api/users/search?username=${query}`
    );

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const CheckFriendShipStatus = async (friendID) => {
  try {
    const response = await axiosInstance.get(
      `/api/users/friendStatus?friendID=${friendID}`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const SendRequestApi = async (receiverID) => {
  try {
    const response = await axiosInstance.post(`/api/users/sendrequest`, {
      receiverID,
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const UnfriendApi = async (friendID) => {
  try {
    const response = await axiosInstance.post(`/api/users/unfriend`, {
      friendID,
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
export const GetNotificationsApi = async () => {
  try {
    const response = await axiosInstance.get(`/api/users/all-notifications`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const AcceptRequestApi = async (requestID, accept) => {
  try {
    const response = await axiosInstance.put("/api/users/acceptrequest", {
      requestID,
      accept,
    });
    return response.data;
  } catch (err) {
    return err.response.data || err.message;
  }
};

export const GetPersonalMessagesApi = async (id, currentPage) => {
  try {
    const response = await axiosInstance.get(
      `/api/messages/personal-messages/${id}?page=${currentPage}`
    );

    return response.data;
  } catch (err) {
    return err.response.data || err.message;
  }
};

export const SendPersonalMessageApi = async (content, friendId) => {
  try {
    const response = await axiosInstance.post(
      `/api/messages/sendmessage/personal/${friendId}`,
      {
        content,
      }
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
