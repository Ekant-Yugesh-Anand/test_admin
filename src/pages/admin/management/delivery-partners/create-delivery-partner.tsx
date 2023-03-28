import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { MainContainer } from "../../../../components/layout";
import { deliveryPartners } from "../../../../http";
import LinkRouter from "../../../../routers/LinkRouter";
import DeliveryPartnerForm, {
  initialValues,
} from "../../../../components/admin/delivery-partner/delivery-partner-form";
import { deliveryPartnerSchema } from "../../../../components/admin/delivery-partner/schemas";
import { filterPhoneNo } from "../../../../components/admin/utils";

export default function CreateRetailers() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: deliveryPartnerSchema,
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await deliveryPartners("post", {
            data: JSON.stringify({
              ...values,
              phone_no: filterPhoneNo(values.phone_no),
            }),
          });
          if (res?.status === 200) {
            navigate(-1);
            setTimeout(() => {
              enqueueSnackbar("Delivery Partner Save  successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error: any) {
          const {
            status,
            data: { message },
          } = error.response;
          if (status === 400) {
            enqueueSnackbar(message, { variant: "error" });
          } else {
            enqueueSnackbar("Delivery Partner Save Failed!😢", {
              variant: "error",
            });
          }
          setLoading(false);
        }
      },
    });

  return (
    <MainContainer>
      <Container>
        <Typography variant="h5">Add New Partner</Typography>
        <Card className="lg:col-span-2">
          <CardContent sx={{ pt: 2 }}>
            <form onSubmit={handleSubmit}>
              <DeliveryPartnerForm
                values={values}
                handleChange={handleChange}
                errors={errors}
                handleBlur={handleBlur}
                touched={touched}
              />
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
                  startIcon={
                    loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : undefined
                  }
                >
                  Save
                </Button>
                <LinkRouter to={-1}>
                  <Button color="secondary" variant="outlined">
                    Close
                  </Button>
                </LinkRouter>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MainContainer>
  );
}
