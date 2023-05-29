import React, { useEffect } from "react";
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
import { productLanguageSchema } from "../../../../components/admin/products/schemas";
import LinkRouter from "../../../../routers/LinkRouter";
import { shopProductDetails } from "../../../../http";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";

import ProductLanguageForm from "../ProductLanguageForm";

export default function LanguageContainer(props: {
  language: any | object;
  ProductData: any | object;
}) {
  const { language, ProductData } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { sku_id } = useParams();
  //   const [data, setData] = React.useState<{ [key: string]: any }>(initialValues);
  const [loading, setLoading] = React.useState(false);

  const onSave = async (value: Record<string, any>) => {
    try {
      let constant = {
        sku_id,
        lang: language.lang_code,
      };
      value = { ...value, ...constant };

      if (ProductData?.detail_id) {
        const res = await shopProductDetails("put", {
          data: JSON.stringify(value),
          params: ProductData?.detail_id,
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
        const res = await shopProductDetails("post", {
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
      sku_id,
      lang: ProductData?.lang || "",
      title: ProductData?.title || "",
      description: ProductData?.description || "",
      ingredients: ProductData?.ingredients || "",
      technical_formula: ProductData?.technical_formula || "",
      doses: ProductData?.doses || "",
      application: ProductData?.application || "",
      target_crop: ProductData?.target_crop || "",
    },
    enableReinitialize: true,
    validationSchema: productLanguageSchema,
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
              <ProductLanguageForm
                values={values}
                productData={ProductData}
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
