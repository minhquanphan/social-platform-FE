import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Card,
  Container,
  Grid,
  Pagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "../../components/SearchInput";
import { getFriendRequests } from "./friendSlice";
import UserCard from "./UserCard";

function FriendRequest() {
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = React.useState(0);

  const { currentPageUsers, usersById, totalUsers, totalPages } = useSelector(
    (state) => state.friend
  );
  const users = currentPageUsers.map((userId) => usersById[userId]);
  const dispatch = useDispatch();

  const handleSubmit = (searchQuery) => {
    setFilterName(searchQuery);
  };

  useEffect(() => {
    dispatch(getFriendRequests({ filterName, page: page + 1 }));
  }, [filterName, page, dispatch]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Friend Requests
      </Typography>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
            <SearchInput handleSubmit={handleSubmit} />

            <Typography
              variant="subtitle"
              sx={{ color: "text.secondary", ml: 1 }}
            >
              {totalUsers > 1
                ? `${totalUsers} requests found`
                : totalUsers === 1
                ? `${totalUsers} request found`
                : "No request found"}
            </Typography>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, page) => setPage(page)}
            />
          </Stack>
          <Grid container spacing={3} my={1}>
            {users.map((user) => (
              <Grid key={user._id} item xs={12} md={4}>
                <UserCard profile={user} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Container>
  );
}

export default FriendRequest;
