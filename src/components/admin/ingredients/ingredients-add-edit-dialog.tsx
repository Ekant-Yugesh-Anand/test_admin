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
import { shopIngredients } from "../../../http/server-api/server-apis";
import { TextInput } from "../../form";
import FileUploader from "../../form/inputs/file-uploader";
import ShopAvatar from "../../Image/shop-avatar";

export default function IngredientAddEditDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  ingredient: { [key: string]: any } | null;
  variant: "edit" | "add";
}) {
  const { open, close, ingredient, reload, variant } = props;
  const [file, setFile] = React.useState<File>(ingredient?.image);
  const [data, setData] = React.useState({
    ingredient_name: ingredient?.ingredient_name || "",
    image: ingredient?.image || "",
  });
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
            enqueueSnackbar("Ingredients update successfully!👍😊", {
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
          enqueueSnackbar("Ingredients update failed!😢", {
            variant: "error",
          }),
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
            enqueueSnackbar("Ingredients add successfully!👍😊", {
              variant: "success",
            }),
          200
        );
        reload();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Ingredients add failed!😢", {
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
      enqueueSnackbar(emptyText("ingredients image"), {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Ingredients {variant}</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 1 }}>
          <TextInput
            type="text"
            label="Ingredient Name"
            name="ingredient_name"
            placeholder="Ingredient Name"
            value={data.ingredient_name}
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
          <Button color="secondary" variant="outlined" onClick={close}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
