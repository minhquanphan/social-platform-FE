import React from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  MenuItem,
  Divider,
  Menu,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import PostEditDialogs from "./PostEditDialog";
import { deletePost } from "./postSlice";
import { useDispatch } from "react-redux";

function PostCard({ post }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    return setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        sx={{ mx: 1 }}
        onClick={() => {
          handleMenuClose();
        }}
      >
        <PostEditDialogs post={post} />
      </MenuItem>

      <Divider sx={{ borderStyle: "dashed" }} />

      <MenuItem
        sx={{ mx: 1 }}
        onClick={() => {
          dispatch(deletePost(post._id));
          handleMenuClose();
        }}
      >
        Delete
      </MenuItem>
    </Menu>
  );
  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <Button>
            <MoreVertIcon sx={{ fontSize: 30 }} onClick={handleMenuOpen} />
            {renderMenu}
          </Button>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
