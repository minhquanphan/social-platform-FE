import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
  updatedPost: null,
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload;
      if (state.currentPagePosts % POST_PER_PAGE === 0) {
        state.currentPagePosts.pop();
      }
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { count, posts } = action.payload;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id)) {
          state.currentPagePosts.push(post._id);
        }
      }); //fixing duplicated id when loading more pagination
      state.totalPosts = count;
    },
    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { reactions, postId } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
    resetPosts(state) {
      state.postsById = {};
      state.currentPagePosts = [];
    },
    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.updatedPost = action.payload;
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.currentPagePosts.splice(
        state.currentPagePosts.indexOf(action.payload._id),
        1
      );
    },
  },
});

export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // upload image to cloudinary
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.createPostSuccess(response.data));
      toast.success("Post successfully");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getPosts =
  ({ userId, page, limit = POST_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      if (page === 1) dispatch(slice.actions.resetPosts()); //
      dispatch(slice.actions.getPostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post("/reactions", {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const editPost =
  ({ id, content, image, userId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { content, image };

      if (image instanceof File) {
        const imageUrl = await cloudinaryUpload(image);
        data.image = imageUrl;
      }

      const response = await apiService.put(`/posts/${id}`, data);
      console.log(response);
      dispatch(slice.actions.editPostSuccess(response.data));
      dispatch(getPosts({ userId }));
      toast.success("Edit successfully");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const deletePost = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/posts/${id}`);
    toast.success("Post delete");
    dispatch(slice.actions.deletePostSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export default slice.reducer;
