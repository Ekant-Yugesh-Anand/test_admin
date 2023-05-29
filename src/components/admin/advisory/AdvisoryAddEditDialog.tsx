import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React from "react";
import { crops } from "../../../http";
import { advisoryPackageSchema } from "./schemas";
import AdvisoryForm from "./AdvisoryPackageForm";
import { shopAdvisoryPackage } from "../../../http/server-api/server-apis";

export default function AdvisoryAddEditDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  advisoryPackage: { [key: string]: any } | null;
  variant: "edit" | "add";
}) {
  const { open, close, advisoryPackage, reload, variant } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const putRequest = async (values: Record<string, any>) => {
    try {
      const res = await shopAdvisoryPackage("put", {
        params: advisoryPackage?.advisory_package_id,
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Package updated successfully", {
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
            error.response?.data?.message || "Package updated failed",
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
      const res = await shopAdvisoryPackage("post", {
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Package added successfully", {
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
            error.response?.data?.message || "Package could not added",
            {
              variant: "error",
            }
          ),
        200
      );
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      package_name:advisoryPackage?.package_name || "",
      gst: advisoryPackage?.gst || "",
      price: advisoryPackage?.price || "",
      cargill_margin_amount:advisoryPackage?.cargill_margin_amount || "",
      cargill_margin:advisoryPackage?.cargill_margin || "",
      vendor_margin_amount:advisoryPackage?.vendor_margin_amount || "",
      vendor_margin: advisoryPackage?.vendor_margin || "",
    }
    ,
    validationSchema: advisoryPackageSchema,
    enableReinitialize: true,
    async onSubmit(values) {
      setLoading(true);
      if(variant == "edit"){
        await putRequest(values)
      }else{
        await postRequest(values)
      }
     
      setLoading(false);
    },
  });

  return (
    <Dialog open={open} fullWidth  >
      <DialogTitle>Advisory Package {variant} </DialogTitle>
      <DialogContent >
        <form onSubmit={handleSubmit}>
          <AdvisoryForm
            values={values}
            handleChange={handleChange}
            errors={errors}
            handleBlur={handleBlur}
            touched={touched}
            setFieldValue={setFieldValue}
          />
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
