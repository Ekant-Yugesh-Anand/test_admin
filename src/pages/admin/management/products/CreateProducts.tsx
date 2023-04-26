import React from "react";
import { MainContainer } from "../../../../components/layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import ProductBasicForm, {
  initialValues,
} from "../../../../components/admin/products/product-basic-form";
import { useFormik } from "formik";
import { productSchema } from "../../../../components/admin/products/schemas";
import LinkRouter from "../../../../routers/LinkRouter";
import { shopProducts } from "../../../../http";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import FileUploader from "../../../../components/form/inputs/file-uploader";
import ShopAvatar from "../../../../components/Image/shop-avatar";
import useBucket from "../../../../hooks/useBucket";
import CommonToolbar from "../../../../components/admin/common-toolbar";

export default function CreateProducts() {
  const { enqueueSnackbar } = useSnackbar();
  const { imgUploader } = useBucket();
  const navigate = useNavigate();
  const [file, setFile] = React.useState<File>();
  const [loading, setLoading] = React.useState(false);

  const onPost = async (data: Record<string, any>) => {
    try {
      const res = await shopProducts("post", {
        data: JSON.stringify(data),
      });

      if (res?.status === 200) {
        navigate(-1);
        setTimeout(() => {
          enqueueSnackbar("Product Save successfully!", {
            variant: "success",
          });
        }, 200);
      }
    } catch (error:any) {
      console.log(error);
      setTimeout(() => {
        enqueueSnackbar(error.response.data.message ? error.response.data.message :"Product Save Failed!", { variant: "error" });
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
    initialValues: initialValues,
    validationSchema: productSchema,
    async onSubmit(values) {
      setLoading(true);
      if (file) {
        try {
          const res = await imgUploader(file);
          if (res.status === "success") {
            await onPost({ ...values, image_url: res.image });
          }
        } catch (error) {
          console.log(error);
          setTimeout(() => {
            enqueueSnackbar("Product Save Failed!", { variant: "error" });
          }, 200);
        }
      } else {
        await onPost(values);
      }
      setLoading(false);
    },
  });


  return (
    <MainContainer>
      <Container>
      <CommonToolbar title="Add New Product"  />
        <Card className="lg:col-span-2">
          <CardContent sx={{ pt: 2 }}>
            <form onSubmit={handleSubmit}>
              <ProductBasicForm
                values={values}
                handleChange={handleChange}
                errors={errors}
                handleBlur={handleBlur}
                touched={touched}
                setFieldValue={setFieldValue}
              />
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <ShopAvatar
                    src={file}
                    imgRectangle
                    sx={{
                      width: "100%",
                      height: 248,
                    }}
                    variant="rounded"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FileUploader handleChange={(file) => setFile(file)} />
                </Grid>
              </Grid>
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
