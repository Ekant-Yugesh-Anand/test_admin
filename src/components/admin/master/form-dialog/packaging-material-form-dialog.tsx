import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
  } from "@mui/material";
  import { useFormik } from "formik";
  import { useSnackbar } from "notistack";
  import { TextInput } from "../../../form";
  import { materialSchema } from "./schemas";
import { shopMaterialPackage } from "../../../../http/server-api/server-apis";
  
  export default function PackagingMaterialFormDialog(props: {
    open: boolean;
    materialData: { [key: string]: any } | null;
    variant: "edit" | "save";
    close: () => void;
    reload: () => void;
  }) {
    const { open, close, materialData, reload, variant } = props;
    const { enqueueSnackbar } = useSnackbar();
  
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
      useFormik({
        initialValues: {
          material: materialData?.material || "",
        },
        validationSchema: materialSchema,
        enableReinitialize: true,
        async onSubmit(values) {
          if (variant === "edit" && materialData) {
            try {
              const res = await shopMaterialPackage("put", {
                params: materialData.material_id,
                data: JSON.stringify(values),
              });
              if (res?.status === 200) {
                close();
                reload();
                setTimeout(() => {
                  enqueueSnackbar("Material Updated  successfully", {
                    variant: "success",
                  });
                }, 200);
              }
            } catch (error) {
              console.log(error);
              setTimeout(() => {
                enqueueSnackbar("Material Update Failed!", {
                  variant: "error",
                });
              }, 200);
              
            }
          } else {
            try {
              const res = await shopMaterialPackage("post", {
                data: JSON.stringify(values),
              });
              if (res?.status === 200) {
                close();
                reload();
                setTimeout(() => {
                  enqueueSnackbar("Material Saved  successfully", {
                    variant: "success",
                  });
                }, 200);
              }
            } catch (error) {
              console.log(error);
              setTimeout(() => {
                enqueueSnackbar("Material save Failed!", {
                  variant: "error",
                });
              }, 200);
            }
          }
        },
      });
  
    return (
      <Dialog open={open} fullWidth>
        <DialogTitle>Packaging Material {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Material Name"
              name="material"
              value={values.material}
              onChange={handleChange}
              error={errors.material && touched.material ? true : false}
              helperText={touched.material ? (errors.material as string) : ""}
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
  