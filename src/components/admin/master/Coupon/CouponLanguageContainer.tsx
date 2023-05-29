import React from "react";
import { MainContainer } from "../../../../components/layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import LinkRouter from "../../../../routers/LinkRouter";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import CouponLanguageForm from "./CouponLanguageForm";
import { coupon_languge_schema } from "../form-dialog/schemas";
import { shopCoupontranslation } from "../../../../http/server-api/server-apis";

export default function CoponLanguageContainer(props: {
  language: any | object;
  CouponData: any | object;
}) {
  const { language, CouponData } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { batch_name } = useParams();
  //   const [data, setData] = React.useState<{ [key: string]: any }>(initialValues);
  const [loading, setLoading] = React.useState(false);

  const onSave = async (value: Record<string, any>) => {
    try {
      let constant = {
        coupon_batch_name: batch_name,
        lang: language.lang_code,
      };
      value = { ...value, ...constant };

      if (CouponData?.coupon_trans_id) {
        const res = await shopCoupontranslation("put", {
          data: JSON.stringify(value),
          params: CouponData?.coupon_trans_id,
        });
        if (res?.status === 200) {
          navigate(-1);
          setTimeout(() => {
            enqueueSnackbar("Save successfully", {
              variant: "success",
            });
          }, 200);
        }
      } else {
        const res = await shopCoupontranslation("post", {
          data: JSON.stringify(value),
        });
        if (res?.status === 200) {
          navigate(-1);
          setTimeout(() => {
            enqueueSnackbar("Save successfully", {
              variant: "success",
            });
          }, 200);
        }
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        enqueueSnackbar("Save Failed", { variant: "error" });
      }, 200);
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
      lang: CouponData?.lang || "",
      batch_name: CouponData?.batch_name || "",
      description: CouponData?.description || "",
    },
    enableReinitialize: true,
    validationSchema: coupon_languge_schema,
    async onSubmit(values) {
      setLoading(true);
      await onSave(values);
      setLoading(false);
    },
  });

  return (
    <MainContainer>
      <Container>
        <Card className="lg:col-span-2">
          <CardContent sx={{ pt: 2 }}>
            <form onSubmit={handleSubmit}>
              <CouponLanguageForm
                values={values}
                productData={CouponData}
                handleChange={handleChange}
                errors={errors}
                handleBlur={handleBlur}
                touched={touched}
                setFieldValue={setFieldValue}
                languageNative={language?.language_native}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexFlow: "row-reverse",
                  my: 2,
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
