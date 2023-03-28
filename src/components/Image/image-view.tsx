import React from "react";
import { Box, styled, Avatar, SxProps, Theme } from "@mui/material";
import ProductAvatar from "./product-avatar";

const Img = styled(ProductAvatar)`
  max-height: 100%;
  width: 100%;
  height: auto;
  display: block;
`;

export default function ImageView(props: {
  src?: string | File;
  useAvatar?: boolean;
  avatarSx?: SxProps<Theme>;
}) {
  const { src, useAvatar, avatarSx } = props;

  const [imgStr, setImgStr] = React.useState("");

  React.useEffect(() => {
    if (typeof src === "string") setImgStr(src);
    if (src instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(src);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImgStr(reader.result);
        }
      };
    }
  }, [src]);

  return useAvatar ? (
    <Avatar src={imgStr} sx={avatarSx} />
  ) : (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        padding: "0.5rem",
        borderRadius: ".25rem",
        display: "flex",
        position: "relative",
      }}
    >
      <Img src={imgStr} alt="" variant="square" />
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "rgba(17,24,39,.7)",
          bottom: ".5rem",
          left: ".5rem",
          right: ".5rem",
          top: ".5rem",
          display: "none",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Box>
    </Box>
  );
}
