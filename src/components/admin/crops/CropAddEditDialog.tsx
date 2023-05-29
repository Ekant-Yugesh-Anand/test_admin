import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React from "react";

import { emptyText } from "../../../constants/messages";
import useBucket from "../../../hooks/useBucket";

import { crops } from "../../../http";
import { TextInput } from "../../form";
import FileUploader from "../../form/inputs/file-uploader";
import ShopAvatar from "../../Image/shop-avatar";
import { cropSchema } from "./schemas";

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
            enqueueSnackbar("Crop updated successfully", {
              variant: "success",
            }),
          2000
        );
        reload();
      }
    } catch (error: any) {
      console.log(error);
      setTimeout(
        () =>
          enqueueSnackbar(
            error.response?.data?.message || "Crop updated failed",
            {
              variant: "error",
            }
          ),
        2000
      );
    }
    setLoading(false)
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
            enqueueSnackbar("Crop added successfully", {
              variant: "success",
            }),
          2000
        );
        reload();
      }
    } catch (error: any) {
      console.log(error);
      setTimeout(
        () =>
          enqueueSnackbar(
            error.response?.data?.message || "Crop could not added",
            {
              variant: "error",
            }
          ),
        2000
      );
    }
    setLoading(false)
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        crop_name: crop?.crop_name || "",
        image: crop?.image || "",
      },
      validationSchema: cropSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        setLoading(true);
        if (file) {
          if (variant === "edit") {
            const metaData = await imgUpdate(values?.image, file);
            if (metaData.status === "success") {
              await putRequest({
                ...values,
                image: metaData.image,
              });
            }
          } else {
            const metaData = await imgUploader(file);
            if (metaData.status === "success") {
              await postRequest({
                ...values,
                image: metaData.image,
              });
            }
          }
        } else {
          setTimeout(
            () =>
              enqueueSnackbar(emptyText("crop image"), {
                variant: "error",
              }),
            2000
          );
        }
        setLoading(false);
      },
    });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Crop {variant}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ my: 1 }}>
            <TextInput
              type="text"
              label="Crop Name"
              name="crop_name"
              placeholder="Crop Name"
              value={values.crop_name}
              onChange={handleChange}
              error={errors.crop_name && touched.crop_name ? true : false}
              helperText={touched.crop_name ? (errors.crop_name as string) : ""}
              onBlur={handleBlur}
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
          <Divider />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              my: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button
              type="submit"
              color="secondary"
              variant="contained"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
