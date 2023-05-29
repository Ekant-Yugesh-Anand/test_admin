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
import { shopIngredients } from "../../../http/server-api/server-apis";
import { TextInput } from "../../form";
import FileUploader from "../../form/inputs/file-uploader";
import ShopAvatar from "../../Image/shop-avatar";
import { ingredientSchema } from "./schemas";

export default function IngredientAddEditDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  ingredient: { [key: string]: any } | null;
  variant: "edit" | "add";
}) {
  const { open, close, ingredient, reload, variant } = props;
  const [file, setFile] = React.useState<File>(ingredient?.image);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { imgUploader, imgUpdate } = useBucket();

  const putRequest = async (values: Record<string, any>) => {
    try {
      const res = await shopIngredients("put", {
        params: ingredient?.ingredient_id,
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Ingredients updated successfully", {
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
          enqueueSnackbar(
            error.response?.data?.message || "Ingredients update failed",
            {
              variant: "error",
            }
          ),
        200
      );
    }
  };
  const postRequest = async (values: Record<string, any>) => {
    try {
      const res = await shopIngredients("post", {
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Ingredients added successfully", {
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
          enqueueSnackbar(
            error.response?.data?.message || "Ingredients add failed!",
            {
              variant: "error",
            }
          ),
        200
      );
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        ingredient_name: ingredient?.ingredient_name || "",
        image: ingredient?.image || "",
      },
      validationSchema: ingredientSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        setLoading(true);
        if (file) {
          if (variant === "edit") {
            const metaData = await imgUpdate(values.image, file);
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
          if (variant === "edit") {
            await putRequest({
              ...values,
            });
          } else {
            await postRequest({
              ...values,
            });
          }
        }
        setLoading(false);
      },
    });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Ingredients {variant}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ my: 1 }}>
            <TextInput
              type="text"
              label="Ingredient Name"
              name="ingredient_name"
              placeholder="Ingredient Name"
              value={values.ingredient_name}
              onChange={handleChange}
              error={
                errors.ingredient_name && touched.ingredient_name ? true : false
              }
              helperText={
                touched.ingredient_name
                  ? (errors.ingredient_name as string)
                  : ""
              }
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
          </Box>
          <FileUploader handleChange={(file) => setFile(file)} />

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
