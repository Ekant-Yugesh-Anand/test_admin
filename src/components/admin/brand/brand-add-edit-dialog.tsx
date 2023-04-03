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
import { brands } from "../../../http";
import { TextInput } from "../../form";
import FileUploader from "../../form/inputs/file-uploader";
import ShopAvatar from "../../Image/shop-avatar";

export default function BrandAddEditDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  brand: { [key: string]: any } | null;
  variant: "edit" | "add";
}) {
  const { open, close, brand, reload, variant } = props;
  const [file, setFile] = React.useState<File>(brand?.brand_image);
  const [data, setData] = React.useState({
    brand_name: brand?.brand_name || "",
    description: brand?.description || "",
    brand_image: brand?.brand_image || "",
  });
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { imgUploader, imgUpdate } = useBucket();

  const putRequest = async (values: Record<string, any>) => {
    try {
      const res = await brands("put", {
        params: brand?.brand_id,
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Brands updated successfully!👍😊", {
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
      const res = await brands("post", {
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Brands added successfully!👍😊", {
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
        const metaData = await imgUpdate(data.brand_image, file);
        if (metaData.status === "success") {
          await putRequest({
            ...data,
            brand_image: metaData.image,
          });
        }
      } else {
        const metaData = await imgUploader(file);
        if (metaData.status === "success") {
          await postRequest({
            ...data,
            brand_image: metaData.image,
          });
        }
      }
    } else {
      enqueueSnackbar(emptyText("brand image"), {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Brand</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 1 }}>
          <TextInput
            type="text"
            label="Brand Name"
            name="brand_name"
            placeholder="brand name"
            value={data.brand_name}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
          />
          <TextInput
            type="text"
            label="Description"
            name="description"
            placeholder="description"
            value={data.description}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            multiline
            rows={4}
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
          <Button color="secondary" variant="outlined" onClick={close}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
