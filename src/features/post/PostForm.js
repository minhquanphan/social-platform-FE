import React, { useRef } from "react";
import { Box, Card, alpha, Stack } from "@mui/material";

import { FormProvider, FTextField } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { createPost } from "./postSlice";

const PostSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

const defaultValues = {
  content: "",
  image: "",
};

function PostForm() {
  const { isLoading } = useSelector((state) => state.post);
  const methods = useForm({
    resolver: yupResolver(PostSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    dispatch(createPost(data)).then(() => reset());
  };

  const fileInput = useRef();
  const handleFile = (e) => {
    const file = fileInput.current.files[0];
    if (file) {
      setValue("image", file);
    }
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
            >
              Post
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default PostForm;
