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
import { useNavigate, useParams } from "react-router-dom";
import useBucket from "../../../../hooks/useBucket";
import ShopAvatar from "../../../../components/Image/shop-avatar";
import FileUploader from "../../../../components/form/inputs/file-uploader";

export default function EditProducts() {
  const { enqueueSnackbar } = useSnackbar();
  const { imgUploader } = useBucket();
  const navigate = useNavigate();
  const { sku_id } = useParams();
  const [data, setData] = React.useState<{ [key: string]: any }>(initialValues);
  const [file, setFile] = React.useState<File>();
  const [loading, setLoading] = React.useState(false);

  const onPut = async (putData: Record<string, any>) => {
    try {
      const res = await shopProducts("put", {
        params: sku_id,
        data: JSON.stringify(putData),
      });

      if (res?.status === 200) {
        navigate(-1);
        setTimeout(() => {
          enqueueSnackbar("Product updated successfully!👍😊", {
            variant: "success",
          });
        }, 200);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        enqueueSnackbar("Product Update Failed!😢", { variant: "error" });
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
    initialValues: data,
    enableReinitialize: true,
    validationSchema: productSchema,
    async onSubmit(values) {
      setLoading(true);
      if (file instanceof File) {
        try {
          const res = await imgUploader(file);
          if (res.status === "success") {
            await onPut({ ...values, image_url: res.image });
          }
        } catch (error) {
          console.log(error);
          setTimeout(() => {
            enqueueSnackbar("Product Update Failed!😢", { variant: "error" });
          }, 200);
        }
      } else {
        await onPut(values);
      }
      setLoading(false);
    },
  });

  const onRetrieve = async () => {
    try {
      const res = await shopProducts("get", {
        params: sku_id,
      });
      if (res?.status === 200) {
        const {
          sku_name,
          sku_name_kannada,
          sku_code,
          hsn_code,
          description,
          ingredients,
          category_id,
          subcategory_id,
          brand_id,
          image_url,
          crop_id,
          ingredient_id,
          
        } = res.data[0];
        setData({
          sku_name,
          sku_name_kannada,
          sku_code,
          hsn_code: hsn_code ? hsn_code : "",
          description: description ? description : "",
          category_id,
          subcategory_id,
          brand_id,
          crop_id,
          ingredients:ingredients ? ingredients :"",
          ingredient_id
        });
        setFile(image_url);
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
        <Typography variant="h5">Edit Product</Typography>
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
                    download={!(file instanceof File)}
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
