import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import FileUploader from "../../../form/inputs/file-uploader";
import { emptyText } from "../../../../constants/messages";
import ShopAvatar from "../../../Image/shop-avatar";
import { shopBanner } from "../../../../http";
import useBucket from "../../../../hooks/useBucket";

export default function BannerFormDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  banner?: { [key: string]: any };
  variant: "edit" | "add";
}) {
  const { open, close, banner, reload, variant } = props;
  const [file, setFile] = React.useState<File>(banner?.image);
  const [data, setData] = React.useState({
    title: banner?.title || "",
    image: banner?.image,
  });
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { imgUploader, imgUpdate } = useBucket();

  const putRequest = async (bannerData: Record<string, any>) => {
    try {
      const res = await shopBanner("put", {
        params: banner?.banner_id,
        data: JSON.stringify(bannerData),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Banner updated successfully!👍😊", {
              variant: "success",
            }),
          200
        );
        reload();
      }
    } catch (error: any) {
      console.log(error);
      setTimeout(
        () =>
          enqueueSnackbar("Banner update failed!😢", {
            variant: "error",
          }),
        200
      );
    }
  };
  const postRequest = async (bannerData: Record<string, any>) => {
    try {
      const res = await shopBanner("post", {
        data: JSON.stringify(bannerData),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Banner added successfully!👍😊", {
              variant: "success",
            }),
          200
        );
        reload();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Banner add failed!😢", {
        variant: "error",
      });
    }
  };

  const onUpload = async () => {
    setLoading(true);
    if (file) {
      if (variant === "edit") {
        const metaData = await imgUpdate(data.image, file);
        if (metaData.status === "success") {
          await putRequest({
            ...data,
            image: metaData.image,
          });
        }
      } else {
        const metaData = await imgUploader(file);
        if (metaData.status === "success") {
          await postRequest({
            ...data,
            image: metaData.image,
          });
        }
      }
    } else {
      enqueueSnackbar(emptyText("banner image"), {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Banner</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 1 }}>
          <TextInput
            type="text"
            label="Title of Image"
            name="title"
            placeholder="Title"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
          />
          <ShopAvatar
            src={file}
            download={!(file instanceof File)}
            imgRectangle
            sx={{
              width: "100%",
              height: 240,
            }}
            variant="rounded"
          />
        </Box>
        <FileUploader handleChange={(file) => setFile(file)} />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexFlow: "row-reverse",
          }}
        >
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={onUpload}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : undefined
            }
          >
            {variant === "add" ? "Save" : "Update"}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            disabled={loading}
            onClick={close}
          >
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
