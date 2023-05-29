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
import { invoiceSchema } from "./schemas";
import AdvisoryInvoiceForm from "./AdvisoryInvoiceForm";
import { shopAdvisory } from "../../../http/server-api/server-apis";

export default function AdvisoryInvoiceAddEditDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  advisoryInvoice: { [key: string]: any } | null;
  variant: "edit" | "add";
}) {
  const { open, close, advisoryInvoice, reload, variant } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const putRequest = async (values: Record<string, any>) => {
    try {
      const res = await shopAdvisory("put", {
        params: advisoryInvoice?.advisory_id,
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Invoice updated successfully", {
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
            error.response?.data?.message || "Inovice updated failed",
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
      const res = await shopAdvisory("post", {
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Invoice added successfully", {
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
            error.response?.data?.message || "Invoice could not added",
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
      farmer_name: advisoryInvoice?.farmer_name || "",
      package: advisoryInvoice?.package || "",
      mobile_no: advisoryInvoice?.mobile_no || "",
      subscribred_crop: advisoryInvoice?.subscribred_crop || "",
      village: advisoryInvoice?.village || "",
      area: advisoryInvoice?.area || "",
      sub_district: advisoryInvoice?.sub_district || "",
      district: advisoryInvoice?.district || "",
      payment_date: advisoryInvoice?.payment_date || "",
      payment_mode: advisoryInvoice?.payment_mode || "",
      paid_amount: advisoryInvoice?.paid_amount || "",
      collected_by: advisoryInvoice?.collected_by || "",
      concern: advisoryInvoice?.concern || "no",
      
    },
    validationSchema: invoiceSchema,
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
    <Dialog open={open} fullWidth maxWidth="md" >
      <DialogTitle>Advisory Charge {variant} </DialogTitle>
      <DialogContent >
        <form onSubmit={handleSubmit}>
          <AdvisoryInvoiceForm
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
