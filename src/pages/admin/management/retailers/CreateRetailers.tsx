import { MainContainer } from "../../../../components/layout";
import { retailer } from "../../../../http";
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
import LinkRouter from "../../../../routers/LinkRouter";
import RetailerForm, {
  initialValues,
} from "../../../../components/admin/retailers/retailer-form";
import { retailerSchema } from "../../../../components/admin/retailers/schemas";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { filterPhoneNo } from "../../../../components/admin/utils";
import CommonToolbar from "../../../../components/admin/common-toolbar";

export default function CreateRetailers() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: retailerSchema,
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await retailer("post", {
            data: JSON.stringify({
              ...values,
              phone_no: filterPhoneNo(values.phone_no),
              margin: values.margin.includes("%") ? values.margin : values.margin+"%"
            }),
          });
          if (res?.status === 200) {
            navigate(-1);
            setTimeout(() => {
              enqueueSnackbar("Retailer Save successfully!👍😊", {
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
            enqueueSnackbar("Retailer Save Failed!😢", { variant: "error" });
          }
          setLoading(false);
        }
      },
    });

  return (
    <MainContainer>
      <Container>
      <CommonToolbar title="Add New Retailer" />
        <Card className="lg:col-span-2">
          <CardContent sx={{ pt: 2 }}>
            <form onSubmit={handleSubmit}>
              <RetailerForm
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
