import CommentReducer from "../features/comment/commentSlice";
import FriendReducer from "../features/friend/friendSlice";
import PostReducer from "../features/post/postSlice";
import UserReducer from "../features/user/userSlice";

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
