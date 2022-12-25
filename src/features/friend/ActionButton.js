import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import {
  acceptRequest,
  cancelRequest,
  declineRequest,
  sendFriendRequest,
  unfriendAction,
} from "./friendSlice";

function ActionButton({ currentUserId, targetUserId, friendship, sx }) {
  const dispatch = useDispatch();
  if (currentUserId === targetUserId) return null;

  const btnSendFriendRequest = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      onClick={() => dispatch(sendFriendRequest(targetUserId))}
    >
      Send Request
    </Button>
  );

  if (!friendship) return btnSendFriendRequest;

  const btnUnfriend = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      color="error"
      onClick={() => dispatch(unfriendAction(targetUserId))}
    >
      Unfriend
    </Button>
  );

  const btnReSend = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      onClick={() => dispatch(sendFriendRequest(targetUserId))}
    >
      {friendship.from === currentUserId ? "Resend" : "Send"} Request
    </Button>
  );

  const btnCancelRequest = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      color="error"
      onClick={() => dispatch(cancelRequest(targetUserId))}
    >
      Cancel Request
    </Button>
  );

  const btnGroupReact = (
    <Stack direction="row" spacing={2}>
      <Button
        sx={{ fontSize: "0.6rem", ...sx }}
        size="small"
        variant="contained"
        color="success"
        onClick={() => dispatch(acceptRequest(targetUserId))}
      >
        Accept
      </Button>
      <Button
        sx={{ fontSize: "0.6rem", ...sx }}
        size="small"
        variant="contained"
        color="error"
        onClick={() => dispatch(declineRequest(targetUserId))}
      >
        Decline
      </Button>
    </Stack>
  );

  if (friendship.status === "accepted") {
    return btnUnfriend;
  }

  if (friendship.status === "declined") {
    return btnReSend;
  }

  if (friendship.status === "pending") {
    const { from, to } = friendship;
    if (from === currentUserId && to === targetUserId) {
      return btnCancelRequest;
    }
    if (from === targetUserId && to === currentUserId) {
      return btnGroupReact;
    }
  }
  return null;
}

export default ActionButton;
