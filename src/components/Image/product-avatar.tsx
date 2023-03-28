import { Avatar as MaterialAvatar, AvatarProps } from "@mui/material";

export interface ProductAvatarPropsI extends AvatarProps {
  imgRectangle?: boolean;
  defaultImg?: AvatarProps;
}

export default function ProductAvatar(props: ProductAvatarPropsI) {
  const { imgRectangle, defaultImg, ...other } = props;

  const defaultImgProps = {
    ...other,
    ...(defaultImg ? defaultImg : {}),
  };
  return (
    <MaterialAvatar
      {...other}
      sx={{
        ...other.sx,
        backgroundColor: "#fff",
        boxShadow: imgRectangle ? 6 : "",
      }}
    >
      {imgRectangle ? (
        <MaterialAvatar
          variant="rounded"
          src="/images/default-image.jpg"
          sx={{
            width: 100,
            height: 100,
          }}
        />
      ) : (
        <MaterialAvatar {...defaultImgProps} src="/images/default-image.jpg" />
      )}
    </MaterialAvatar>
  );
}
