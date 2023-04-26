import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { shopPackages } from "../../../../http";
import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import { packageSchema } from "./schemas";

export default function PackageFormDialog(props: {
  open: boolean;
  packageData: { [key: string]: any } | null;
  variant: "edit" | "save";
  close: () => void;
  reload: () => void;
}) {
  const { open, close, packageData, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        package: packageData?.package || "",
      },
      validationSchema: packageSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        if (variant === "edit" && packageData) {
          try {
            const res = await shopPackages("put", {
              params: packageData.package_id,
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Package updated  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error:any) {
            console.log(error);
            enqueueSnackbar(error.response?.data?.message || "Package Update Failed!😢", {
              variant: "error",
            });
          }
        } else {
          try {
            const res = await shopPackages("post", {
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar( "Package Saved  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error:any) {
            console.log(error);
            setTimeout(() => {
              enqueueSnackbar(error.response?.data?.message || "Package Could not save", {
                variant: "error",
              });
            }, 200);
           
          }
        }
      },
    });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Package {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Package Name"
            name="package"
            value={values.package}
            onChange={handleChange}
            error={errors.package && touched.package ? true : false}
            helperText={touched.package ? (errors.package as string) : ""}
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
