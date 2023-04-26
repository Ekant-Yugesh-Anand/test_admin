import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React from "react";
import { useParams } from "react-router-dom";
import {
  shopMaterialPackage,
  shopRetailerMaterialPackage,
} from "../../../http/server-api/server-apis";
import { TextInput } from "../../form";
import AsyncAutocomplete from "../../form/async-autocomplete";
import { materialSchema } from "../master/form-dialog/schemas";
import { retailerMaterialSchema } from "./schemas";

export default function RetailerPackagingMaterialFormDialog(props: {
  open: boolean;
  materialData: { [key: string]: any } | null;
  variant: "edit" | "save";
  close: () => void;
  reload: () => void;
}) {
  const { retailer_id } = useParams();
  const { open, close, materialData, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [materials, setMaterials] = React.useState<
    Array<{ [key: string]: any }>
  >([]);

  const { isLoading: materialLoading } = useQuery(
    ["get-all-material"],
    () =>
      shopMaterialPackage("get", {
        params: "material",
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setMaterials(data.data instanceof Array ? data.data : []);
      },
    }
  );

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
      material_id: materialData?.material_id || "",
      quantity: materialData?.quantity || "",
      remark: materialData?.remark || "",
      issue_date: materialData?.issue_date || "",
    },
    validationSchema: retailerMaterialSchema,
    enableReinitialize: true,
    async onSubmit(values) {
  
      if (variant === "edit" && materialData) {
        try {
          const res = await shopRetailerMaterialPackage("put", {
            params: materialData.ret_mat_id,
            data: JSON.stringify({
              ...values,
              retailer_id,
            }),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Material Updated  successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Material Update Failed!😢", {
            variant: "error",
          });
        }
      } else {
        try {
          const res = await shopRetailerMaterialPackage("post", {
            data: JSON.stringify({
              ...values,
              retailer_id,
              issue_date:values?.issue_date || dayjs().format("YYYY-MM-DD HH:mm:ss"), 
            }),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Material Save  successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Materail Save Failed!😢", {
            variant: "error",
          });
        }
      }
    },
  });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle> Material {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Box sx={{ my: 1 }}>
              <AsyncAutocomplete
                id="material-option"
                loading={materialLoading}
                label="Materials"
                options={materials || []}
                objFilter={{
                  title: "material",
                  value: "material_id",
                }}
                value={values?.material_id}
                onChangeOption={(value) => {
                  setFieldValue("material_id", value);
                }}
                TextInputProps={{
                  error:
                    errors["material_id"] && touched["material_id"]
                      ? true
                      : false,
                  helperText: touched["material_id"]
                    ? (errors["material_id"] as string)
                    : "",
                  onBlur: handleBlur,
                }}
              />
            </Box>
            {/* {console.log(values)} */}
            <Box sx={{ my: 1 }}>
              <DatePicker
                label="Issue Date"
                inputFormat="DD/MM/YYYY"
                value={dayjs(values?.issue_date || dayjs().format("YYYY-MM-DD HH:mm:ss"))}
                onChange={(value) => {
                  setFieldValue("issue_date", value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    sx={{
                      "& .MuiInputBase-input:focus": {
                        boxShadow: "none",
                      },
                    }}
                    size="small"
                  />
                )}
              />
            </Box>

            <TextInput
              label="Quantity"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
              error={errors.quantity && touched.quantity ? true : false}
              helperText={touched.quantity ? (errors.quantity as string) : ""}
              onBlur={handleBlur}
            />
          </div>

          <TextInput
            label="Remark"
            name="remark"
            multiline={true}
            rows="4"
            value={values.remark}
            onChange={handleChange}
            error={errors.remark && touched.remark ? true : false}
            helperText={touched.remark ? (errors.remark as string) : ""}
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
