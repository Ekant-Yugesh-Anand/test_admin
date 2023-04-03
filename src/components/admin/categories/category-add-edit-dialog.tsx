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
import { categories, subCategories } from "../../../http";
import { TextInput } from "../../form";
import FileUploader from "../../form/inputs/file-uploader";
import ShopAvatar from "../../Image/shop-avatar";

export default function CategoryAddEditDialog(props: {
  open: boolean;
  close: () => void;
  reload: () => Promise<any>;
  category?: { [key: string]: any };
  variant: "edit" | "add";
  type: "category" | "subcategory";
  otherData?: Record<string, any>;
}) {
  const { open, close, category, reload, variant, type, otherData } = props;
  const [file, setFile] = React.useState<File>(category?.image);
  const [data, setData] = React.useState({
    name: category?.name || "",
    description: category?.description || "",
    image: category?.image || "",
  });
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const cateLabel = React.useMemo(
    () => (type === "category" ? "Category" : "SubCategory"),
    []
  );

  const { imgUploader, imgUpdate } = useBucket();

  const putRequest = async (values: Record<string, any>) => {
    try {
      const res = await (type === "category" ? categories : subCategories)(
        "put",
        {
          params: category?.category_id,
          data: JSON.stringify(values),
        }
      );
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar(cateLabel + " updated successfully!👍😊", {
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
          enqueueSnackbar(cateLabel + " update failed!😢", {
            variant: "error",
          }),
        200
      );
    }
  };
  const postRequest = async (values: Record<string, any>) => {
    try {
      const res = await (type === "category" ? categories : subCategories)(
        "post",
        {
          data: JSON.stringify(values),
        }
      );
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar(cateLabel + " added successfully!👍😊", {
              variant: "success",
            }),
          200
        );
        reload();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(cateLabel + " add failed!😢", {
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
            ...otherData,
            image: metaData.image,
          });
        }
      } else {
        const metaData = await imgUploader(file);
        if (metaData.status === "success") {
          await postRequest({
            ...data,

            ...otherData,
            image: metaData.image,
          });
        }
      }
    } else {
      enqueueSnackbar(emptyText(type + " image"), {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{cateLabel}</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 1 }}>
          <TextInput
            type="text"
            label={cateLabel.concat(" Name")}
            name="name"
            placeholder="category name"
            value={data.name}
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
