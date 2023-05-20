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
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { MainContainer } from "../../../../components/layout";
import { deliveryPartners } from "../../../../http";
import LinkRouter from "../../../../routers/LinkRouter";
import DeliveryPartnerForm, {
  initialValues,
} from "../../../../components/admin/delivery-partner/delivery-partner-form";
import { deliveryPartnerSchema } from "../../../../components/admin/delivery-partner/schemas";
import { filterPhoneNo, margeObj } from "../../../../components/admin/utils";
import CommonToolbar from "../../../../components/admin/common-toolbar";

export default function CreateRetailers() {
  const [data, setData] = React.useState(initialValues);

  const { partner_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: data,
      validationSchema: deliveryPartnerSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await deliveryPartners("put", {
            params: partner_id,
            data: JSON.stringify({
              ...values,
              phone_no: filterPhoneNo(values.phone_no),
            }),
          });
          if (res?.status === 200) {
            navigate(-1);
            setTimeout(() => {
              enqueueSnackbar("Delivery Partner Update  successfully!👍😊", {
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
            enqueueSnackbar("Delivery Partner Failed!😢", { variant: "error" });
          }
          setLoading(false);
        }
      },
    });

  const onRetrieve = async () => {
    try {
      const res = await deliveryPartners("get", {
        params: partner_id,
      });
      if (res?.status === 200) {
        const { data } = res;
        setData(
          margeObj(initialValues, {
            ...data,
            phone_no: filterPhoneNo(data?.phone_no, true),
          }) as typeof data
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    onRetrieve();
  }, []);

  return (
    <MainContainer>
      <Container>
      <CommonToolbar title="Edit Partner" />
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
                  Update
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
