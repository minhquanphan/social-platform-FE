import React, { useRef } from "react";
import { Box, Card, alpha, Stack } from "@mui/material";

import { FormProvider, FTextField } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { editPost } from "./postSlice";
import useAuth from "../../hooks/useAuth";

const PostSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

function PostEditForm({ post }) {
  const { isLoading } = useSelector((state) => state.post);
  const { user } = useAuth();
  const userId = user._id;

  const defaultValues = {
    content: post?.content || "",
    image: post?.image || "",
  };

  const methods = useForm({
    resolver: yupResolver(PostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();

  const fileInput = useRef();
  const handleFile = (e) => {
    const file = fileInput.current.files[0];
    if (file) {
      setValue("image", file);
    }
  };

  const onSubmit = (data) => {
    if (post.author._id === user._id) {
      dispatch(editPost({ id: post._id, ...data, userId }));
    } else alert("you not is author post!");
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FTextField
            name="content"
            multiline
            fullWidth
            rows={4}
            placeholder="Share what you are thinking here..."
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />

          {/* <FTextField name="Image" placeholder="Image" /> */}

          <input type="file" ref={fileInput} onChange={handleFile} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              allignItem: "center",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={isSubmitting || isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default PostEditForm;
