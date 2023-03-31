import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { shopRetailerProductPrice } from "../../../../http";
import { TextInput } from "../../../form";
import { NumericFormat } from "react-number-format";
import { skuPricingSchema } from "./schemas";

export default function SkuPricingUpdateDialog(props: {
  open: boolean;
  close: () => void;
  skuPrice: Record<string, any>;
  reload: () => void;
}) {
  const { open, close, skuPrice, reload } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        sale_price: skuPrice.sale_price || 0,
        mrp: skuPrice.mrp || 0,
        quantity: skuPrice.quantity || 0,
        used_quantity: skuPrice.used_quantity || 0,
        margin: skuPrice.margin || 0,
        margin_amount: skuPrice.margin_amount || 0,
      },
      validationSchema: skuPricingSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await shopRetailerProductPrice("put", {
            params: skuPrice.product_price_id,
            data: JSON.stringify({
              sale_price:
                typeof values.sale_price === "string"
                  ? Number(values.sale_price)
                  : values.sale_price,
              retailer_id: skuPrice.retailer_id,
              sku_id: skuPrice.sku_id,
              price_id: skuPrice.price_id,
              used_quantity: values.used_quantity,
              quantity: values.quantity,
              margin: values.margin.includes("%") ? values.margin : values.margin+"%",
              margin_amount: `${(+values.sale_price * +values.margin?.split("%")[0]) / 100}`
            }),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("SKU Price Update successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("SKU Price Update Failed!😢", {
            variant: "error",
          });
        }
        setLoading(false);
      },
    });


  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>SKU Price Edit</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <NumericFormat
            value={values.mrp}
            customInput={TextInput}
            label="MRP"
            name="mrp"
            onChange={handleChange}
            disabled={true}
            error={errors.mrp && touched.mrp ? true : false}
            helperText={touched.mrp ? (errors.mrp as string) : ""}
            onBlur={handleBlur}
          />
          <NumericFormat
            value={values.sale_price}
            customInput={TextInput}
            label="Sale Price"
            name="sale_price"
            onChange={handleChange}
            error={errors.sale_price && touched.sale_price ? true : false}
            helperText={touched.sale_price ? (errors.sale_price as string) : ""}
            onBlur={handleBlur}
          />
          <TextInput
            value={values.margin}
            label="Margin (%)"
            name="margin"
            onChange={handleChange}
            error={errors.margin && touched.margin ? true : false}
            helperText={touched.margin ? (errors.margin as string) : ""}
            onBlur={handleBlur}
           
          />
          <NumericFormat
            value={
              values.margin
                ? (+values.sale_price * +values.margin.split("%")[0]) / 100
                : 0
            }
            
            customInput={TextInput}
            label="Margin Amount"
            name="margin_amount"
            onChange={handleChange}
            error={errors.margin_amount && touched.margin_amount ? true : false}
            helperText={touched.margin_amount ? (errors.margin_amount as string) : ""}
            onBlur={handleBlur}
       
          />
          <NumericFormat
            value={values.quantity}
            customInput={TextInput}
            label="Quantity"
            name="quantity"
            onChange={handleChange}
            error={errors.quantity && touched.quantity ? true : false}
            helperText={touched.quantity ? (errors.quantity as string) : ""}
            onBlur={handleBlur}
          />
          <NumericFormat
            value={values.used_quantity}
            customInput={TextInput}
            label="Used Quantity"
            name="used_quantity"
            onChange={handleChange}
            error={errors.used_quantity && touched.used_quantity ? true : false}
            helperText={
              touched.used_quantity ? (errors.used_quantity as string) : ""
            }
            onBlur={handleBlur}
          />
          <NumericFormat
            value={+values.quantity - +values.used_quantity}
            customInput={TextInput}
            label="Qantity in stock"
            name="used_quantity"
            disabled={true}
          />
          </div>
         
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button
              disabled={loading}
              type="submit"
              color="secondary"
              variant="contained"
            >
              Update
            </Button>
            <Button
              disabled={loading}
              color="secondary"
              variant="outlined"
              onClick={close}
            >
              Close
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
