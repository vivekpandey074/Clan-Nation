import { axiosInstance } from "./axiosInstance";

const CreateClanApi = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/clans/createclan", payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const SearchClanApi = async (query, currentPage) => {
  try {
    const response = await axiosInstance.get(
      `/api/clans/search?query=${query}&page=${currentPage}`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const GetJoinedClansApi = async () => {
  try {
    const response = await axiosInstance.get("/api/clans/joinedclans");
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const GetClanDetailsApi = async (clanId) => {
  try {
    const response = await axiosInstance.get(`/api/clans/clan/${clanId}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const GetClanMessagesApi = async (clanId, currentPage) => {
  try {
    const response = await axiosInstance.get(
      `/api/messages/clan-messages/${clanId}?page=${currentPage}`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const SendMessageApi = async (content, clanId) => {
  try {
    const response = await axiosInstance.post(
      `/api/messages/sendmessage/clan/${clanId}`,
      {
        content,
      }
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const JoinClanApi = async (clan, user) => {
  try {
    const response = await axiosInstance.put("/api/clans/add-member", {
      clanId: clan._id,
      newMember: user._id,
    });

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const LeaveClanApi = async (clan) => {
  try {
    const response = await axiosInstance.put(`/api/clans/leave/${clan._id}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export {
  CreateClanApi,
  SearchClanApi,
  GetJoinedClansApi,
  GetClanMessagesApi,
  GetClanDetailsApi,
  SendMessageApi,
  JoinClanApi,
  LeaveClanApi,
};
