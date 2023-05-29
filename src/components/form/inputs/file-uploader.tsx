import React from "react";
import { useSnackbar } from "notistack";
import { styled, Typography } from "@mui/material";
import { FileUploader as ReactFileUploader } from "react-drag-drop-files";
import upload from "../../../assets/upload.png";

const ImageContainer = styled("div")`
  --tw-border-opacity: 1;
  align-items: center;
  border-color: #d1dbd9;
  border-radius: 0.5rem;
  border-style: dashed;
  border-width: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  position: relative;

  :hover {
    border-color: green;
  }

  img {
    margin-left: auto;
    margin-right: auto;
  }
`;

const LabelContainer = styled("div")`
  text-align: center;
`;

export default function FileUploader(props: {
  handleChange?: (file: File) => void;
  multiple?:boolean;

}) {
  const { handleChange , multiple} = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const sizeError = (file: any) =>
    enqueueSnackbar(file, {
      variant: "error",
    });

  const typeError = (err: any) => enqueueSnackbar(err, { variant: "error" });

  React.useEffect(() => () => closeSnackbar());

  return (
    <ReactFileUploader
      types={["JPEG", "PNG", "JPG"]}
      onTypeError={typeError}
      onSizeError={sizeError}
      multiple={multiple ? multiple :false}
      maxSize={2}
      handleChange={handleChange}
    >
      <ImageContainer sx={{ p: 1, minHeight: "fit-content" }}>
        <LabelContainer sx={{ my: 4 }}>
          <Typography>
            <img src={upload} alt="image-logo" />
            <Typography component={"span"} color="black">
              Drop your image here, or{" "}
            </Typography>
            <Typography component={"span"} color="blue">
              browse
            </Typography>
          </Typography>
          <Typography
            sx={{
              color: "neutral.400",
            }}
          >
            Image size should be square (500) x (500),
            <br />
            Image size must be less than 2 mb
            <br/>
            Support: jpeg, png, jpg
          </Typography>
        </LabelContainer>
      </ImageContainer>
    </ReactFileUploader>
  );
}
