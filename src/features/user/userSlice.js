import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  error: null,
  selectedUser: null,
  updatedUser: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.selectedUser = action.payload;
    },
    updateUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.updatedUser = action.payload;
    },
  },
});

export const getUserProfile = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/users/${id}`);
    dispatch(slice.actions.getUserProfileSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const updateUserProfile =
  ({
    id,
    name,
    avatarUrl,
    coverUrl,
    aboutMe,
    city,
    country,
    company,
    jobTitle,
    facebookLink,
    instagramLink,
    linkedinLink,
    twitterLink,
  }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        name,
        avatarUrl,
        coverUrl,
        aboutMe,
        city,
        country,
        company,
        jobTitle,
        facebookLink,
        instagramLink,
        linkedinLink,
        twitterLink,
      };
      const response = await apiService.put(`/users/${id}`, data);
      dispatch(slice.actions.updateUserProfileSuccess(response.data));
      toast.success("Update Profile Successfully");
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };
export default slice.reducer;
