import React, { useEffect } from "react";

import { Pagination, Stack, Typography } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import CommentCard from "./CommentCard";
import LoadingScreen from "../../components/LoadingScreen";
import { getComments } from "./commentSlice";
import { COMMENT_PER_PAGE } from "../../app/config";

function CommentList({ postId }) {
  const {
    commentsByPost,
    commentsById,
    totalCommentsByPost,
    isLoading,
    currentPageByPost,
  } = useSelector(
    (state) => ({
      commentsByPost: state.comment.commentsByPost[postId],
      totalCommentsByPost: state.comment.totalCommentsByPost[postId],
      currentPageByPost: state.comment.currentPageByPost[postId] || 1,
      commentsById: state.comment.commentsById,
      isLoading: state.comment.isLoading,
    }),
    shallowEqual
  );

  const totalPages = Math.ceil(totalCommentsByPost / COMMENT_PER_PAGE);
  const dispatch = useDispatch();

  let renderComments;

  if (commentsByPost) {
    const comments = commentsByPost.map((commentId) => commentsById[commentId]);
    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    renderComments = <LoadingScreen />;
  }

  useEffect(() => {
    if (postId) dispatch(getComments({ postId }));
  }, [postId, dispatch]);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalCommentsByPost > 1
            ? `${totalCommentsByPost} comments`
            : totalCommentsByPost === 1
            ? `${totalCommentsByPost} comment`
            : "No comment"}
        </Typography>
        {totalCommentsByPost > COMMENT_PER_PAGE && (
          <Pagination
            count={totalPages}
            page={currentPageByPost}
            onChange={(e, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComments}
    </Stack>
  );
}

export default CommentList;
