import React from "react";
import ProductAvatar, { ProductAvatarPropsI } from "./product-avatar";
import useBucket from "../../hooks/useBucket";

type Modify<T, R> = Omit<T, keyof R> & R;

interface PropsI
  extends Modify<
    ProductAvatarPropsI,
    {
      src?: string | File;
    }
  > {
  download?: boolean;
}

function ShopAvatar(props: PropsI) {
  const { src, download, ...otherProps } = props;
  const [imgStr, setImgStr] = React.useState("");
  const { imgDownload } = useBucket();

  const onDownload = async () => {
    if (typeof src === "string") {
      if (!src.includes("http")) {
        try {
          const res = await imgDownload(src);
          if (res.status === 200) setImgStr(URL.createObjectURL(res.data));
        } catch (error) {
          // console.log(error);
        }
      } else {
        setImgStr(src);
      }
    }
  };

  React.useEffect(() => {
    if (download && typeof src === "string") onDownload();
    else {
      if (typeof src === "string") setImgStr(src);
      else if (src instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(src);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImgStr(reader.result);
          }
        };
      }
    }
  }, [src, download]);

  return <ProductAvatar {...otherProps} src={imgStr} />;
}

export default React.memo(ShopAvatar);
