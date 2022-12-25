import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  error: null,
  currentPageUsers: [],
  usersById: {},
  totalPages: 1,
};

const slice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { users, totalPages, count } = action.payload;
      users.forEach((user) => {
        state.usersById[user._id] = user;
      });
      state.currentPageUsers = users.map((user) => user._id);
      state.totalPages = totalPages;
      state.totalUsers = count;
    },
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { users, totalPages, count } = action.payload;
      users.forEach((user) => {
        state.usersById[user._id] = user;
      });
      state.currentPageUsers = users.map((user) => user._id);
      state.totalPages = totalPages;
      state.totalUsers = count;
    },
    sendRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    acceptRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    declineRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    cancelRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId } = action.payload;
      state.usersById[targetUserId].friendship = null;
    },
    unfriendSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId } = action.payload;
      state.usersById[targetUserId].friendship = null;
    },
  },
});

export const getUsers =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      if (filterName) {
        params.name = filterName;
      }
      const respone = await apiService.get("/users", { params });
      dispatch(slice.actions.getUsersSuccess(respone.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
export const getFriends =
  ({ filterName, page = 1, limit }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      if (filterName) {
        params.name = filterName;
      }
      const respone = await apiService.get("/friends", { params });
      dispatch(slice.actions.getFriendsSuccess(respone.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendFriendRequest = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const respone = await apiService.post("/friends/requests", {
      to: targetUserId,
    });
    dispatch(
      slice.actions.sendRequestSuccess({ ...respone.data, targetUserId })
    );
    toast.success("Request send");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const acceptRequest = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const respone = await apiService.put(`/friends/requests/${targetUserId}`, {
      status: "accepted",
    });
    dispatch(
      slice.actions.acceptRequestSuccess({ ...respone.data, targetUserId })
    );
    toast.success("Request accepted");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const declineRequest = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const respone = await apiService.put(`/friends/requests/${targetUserId}`, {
      status: "declined",
    });
    dispatch(
      slice.actions.declineRequestSuccess({ ...respone.data, targetUserId })
    );
    toast.success("Request declined");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const cancelRequest = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const respone = await apiService.delete(
      `/friends/requests/${targetUserId}`,
      {}
    );
    dispatch(
      slice.actions.cancelRequestSuccess({ ...respone.data, targetUserId })
    );
    toast.success("Request cancelled");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const unfriendAction = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const respone = await apiService.delete(`/friends/${targetUserId}`, {});
    dispatch(
      slice.actions.deleteRequestSuccess({ ...respone.data, targetUserId })
    );
    toast.success("Friend removed");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};
export default slice.reducer;
