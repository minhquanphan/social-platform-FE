import CommentReducer from "../features/comment/CommentSlice";
import FriendReducer from "../features/friend/FriendSlice";
import PostReducer from "../features/post/PostSlice";
import UserReducer from "../features/user/UserSlice";

const { configureStore } = require("@reduxjs/toolkit");

const rootReducer = {
  comment: CommentReducer,
  friend: FriendReducer,
  post: PostReducer,
  user: UserReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
