import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Box,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { TextInput } from "../../form";
import { shopRetailerCategories } from "../../../http/server-api/server-apis";
import { useParams } from "react-router-dom";
import { marginSchema } from "./schemas";

export default function EditMarginFormDialog(props: {
  open: boolean;
  category: { [key: string]: any } | null;
  close: () => void;
  reload: () => void;
  variant: "category" | "sub_category";
}) {
  const { retailer_id } = useParams();
  const { open, close, category, reload , variant} = props;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        margin: category?.margin || "",
        change: "no",
      },
        validationSchema: marginSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        setLoading(true);
        
        let id = variant =="category"? {
            category_id:category?.category_id || "",
        } : {
            subcategory_id:category?.category_id || ""
        }

        try {
          const res = await shopRetailerCategories("put", {
            params: category?.retailer_category_id || "",
            data: JSON.stringify({
              ...values,
              ...id,
              margin: values.margin.includes("%")
                ? values.margin
                : values.margin + "%",
              retailer_id,
            }),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Margin Updated  successfully!", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Margin Updated Failed!😢", {
            variant: "error",
          });
        }
        setLoading(false);
      },
    });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Update Margin </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            label="Margin"
            name="margin"
            placeholder="Add margin (%)"
            value={values.margin || ""}
            onChange={handleChange}
            error={errors.margin && touched.margin ? true : false}
            helperText={touched.margin ? errors.margin as string :""}
            onBlur={handleBlur}
          />
          <Box sx={{ my: 2 }}>
            <Typography
              component={"label"}
              sx={{ display: "block", color: "#6b7280", fontWeight: 600 }}
            >
              Change Existing Product Margin
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="change"
              value={values.change}
              onChange={handleChange}
            >
              <FormControlLabel
                value="yes"
                control={<Radio color="secondary" />}
                label="Yes"
              />
              <FormControlLabel
                value="no"
                control={<Radio color="secondary" />}
                label="No"
              />
            </RadioGroup>
          </Box>
          <Divider sx={{ my: 1 }} />
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
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : undefined
              }
            >
              <span className="first-letter:uppercase">Update</span>
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
