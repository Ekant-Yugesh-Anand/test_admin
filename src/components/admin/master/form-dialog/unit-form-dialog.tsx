import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { shopUnits } from "../../../../http";
import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import { unitSchema } from "./schemas";

export default function UnitFormDialog(props: {
  open: boolean;
  close: () => void;
  unit: { [key: string]: any } | null;
  reload: () => void;
  variant: "edit" | "save";
}) {
  const { open, close, unit, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        units: unit?.units || "",
      },
      validationSchema: unitSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        if (variant === "edit" && unit) {
          try {
            const res = await shopUnits("put", {
              params: unit.units_id,
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Unit Update  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Unit Update Failed!😢", {
              variant: "error",
            });
          }
        } else {
          try {
            const res = await shopUnits("post", {
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Unit Save  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Unit Save Failed!😢", {
              variant: "error",
            });
          }
        }
      },
    });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Unit {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Unit Name"
            name="units"
            value={values.units}
            onChange={handleChange}
            error={errors.units && touched.units ? true : false}
            helperText={touched.units ? (errors.units as string) : ""}
            onBlur={handleBlur}
          />
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
