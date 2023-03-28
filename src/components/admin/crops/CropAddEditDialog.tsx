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
import React from "react";

import { emptyText } from "../../../constants/messages";
import useBucket from "../../../hooks/useBucket";

import { crops } from "../../../http";
import { TextInput } from "../../form";
import FileUploader from "../../form/inputs/file-uploader";
import ShopAvatar from "../../Image/shop-avatar";

export default function CropAddEditDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  crop: { [key: string]: any } | null;
  variant: "edit" | "add";
}) {

  const { imgUploader, imgUpdate } = useBucket();
  const { open, close, crop, reload, variant } = props;
  const [file, setFile] = React.useState<File>(crop?.image);
  const [data, setData] = React.useState({
    crop_name: crop?.crop_name || "",
    image:crop?.image || ""
  });
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const putRequest = async (values: Record<string, any>) => {
    try {
      const res = await crops("put", {
        params: crop?.crop_id,
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Brands update successfully!👍😊", {
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
          enqueueSnackbar("Brands update failed!😢", {
            variant: "error",
          }),
        200
      );
    }
  };
  const postRequest = async (values: Record<string, any>) => {
    try {
      const res = await crops("post", {
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Brands add successfully!👍😊", {
              variant: "success",
            }),
          200
        );
        reload();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Brands add failed!😢", {
        variant: "error",
      });
    }
  };

  const onUpload = async () => {
    setLoading(true);
    if (file) {
      if (variant === "edit") {
        const metaData = await imgUpdate(data?.image, file);
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
      enqueueSnackbar(emptyText("crop image"), {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Crop {variant}</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 1 }}>
          <TextInput
            type="text"
            label="Crop Name"
            name="crop_name"
            placeholder="Crop name"
            value={data.crop_name}
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
          <FileUploader
            handleChange={(file: React.SetStateAction<File>) => setFile(file)}
          />
        </Box>
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
          <Button color="secondary" variant="outlined" onClick={close}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
