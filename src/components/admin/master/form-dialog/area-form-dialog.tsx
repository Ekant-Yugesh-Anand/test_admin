import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { TextInput } from "../../../form";
import { shopAreas } from "../../../../http";
import { areaSchema } from "./schemas";
import { NumericFormat } from "react-number-format";


export default function AreaFormDialog(props: {
  open: boolean;
  area: { [key: string]: any } | null;
  variant: "edit" | "save";
  close: () => void;
  reload: () => void;
}) {
  const { open, close, area, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        area: area?.area || "",
        city: area?.city || "",
        state: area?.state || "",
        country: area?.country || "",
        pincode: area?.pincode || "",
      },
      validationSchema: areaSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        if (variant === "edit" && area) {
          try {
            const res = await shopAreas("put", {
              params: area.area_id,
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Area Updated  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Area Update Failed!😢", {
              variant: "error",
            });
          }
        } else {
          try {
            const res = await shopAreas("post", {
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Area Saved  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error : any) {
            console.log(error);
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
            });
          }
        }
      },
    });

  const basicFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "Area",
        name: "area",
        placeholder: "Area",
      },
      {
        type: "text",
        label: "City",
        name: "city",
        placeholder: "city",
      },
      {
        type: "text",
        label: "State",
        name: "state",
        placeholder: "state",
      },
      {
        type: "text",
        label: "Country",
        name: "country",
        placeholder: "country",
      },
      {
        type: "numeric",
        label: "Pincode",
        name: "pincode",
        placeholder: "pincode",
      },
    ],
    []
  );

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Area {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {basicFields.map((item, index) => {
            const { type, ...others } = item;
            return type === "numeric" ? (
              <NumericFormat
                {...others}
                size="small"
                key={index}
                value={(values as any)[item.name] || ""}
                onChange={handleChange}
                error={
                  (errors as any)[item.name] && (touched as any)[item.name]
                    ? true
                    : false
                }
                helperText={
                  (touched as any)[item.name] ? (errors as any)[item.name] : ""
                }
                onBlur={handleBlur}
                customInput={TextInput}
              />
            ) : (
              <TextInput
                key={index}
                {...item}
                value={(values as any)[item.name] || ""}
                onChange={handleChange}
                error={
                  (errors as any)[item.name] && (touched as any)[item.name]
                    ? true
                    : false
                }
                helperText={
                  (touched as any)[item.name] ? (errors as any)[item.name] : ""
                }
                onBlur={handleBlur}
              />
            );
          })}
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button type="submit" color="secondary" variant="contained">
              <span className="first-letter:uppercase">
                {variant === "edit" ? "update" : variant}
              </span>
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
