import React from "react";
import { MainContainer } from "../../../../components/layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";

import LinkRouter from "../../../../routers/LinkRouter";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../../../../components/admin/retailers/category-form";
import SelectedCategoryData from "../../../../components/admin/retailers/SelectedCategory";
import { shopRetailerCategories } from "../../../../http/server-api/server-apis";

export default function AddCategory() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [loading, setLoading] = React.useState(false);
  const { retailer_id } = useParams();

  const shopCategorySaveHandler = async () => {
    setLoading(true);
    try {
      const res = await shopRetailerCategories("post", {
        data: JSON.stringify({
          retailer_id,
          categories: categoryData,
        }),
      });

      if (res?.status === 200) {
        navigate(-1);
        setTimeout(() => {
          enqueueSnackbar("Category data Save successfully", {
            variant: "success",
          });
        }, 200);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        enqueueSnackbar("Category Data Save Failed!😢", { variant: "error" });
      }, 200);
    }
    setLoading(false);
  };

  const categoryHandler = (data: any, del: boolean) => {
    const filterTempData = (
      data: Array<{ [key: string]: any }>,
      id: string | number
    ) => {
      let obj = data.find((o) => o.subcategory_id == id);
      return obj;
    };

    const updateState = () => {
      const newState = categoryData.map((category) => {
        if (category.category_id == data.category_id) {
          let tempdata = category.subcategories;
          let filterdata = filterTempData(
            category.subcategories,
            data.subcategory_id
          );
          filterdata
            ? setTimeout(() => {
                enqueueSnackbar("Already selected!😢", { variant: "error" });
              }, 200)
            : tempdata.push({
                subcategory_id: data.subcategory_id,
                margin: data.margin + "%",
                change: data.change,
              });
          return {
            ...category,
            subcategories: tempdata,
          };
        }

        return category;
      });
      setCategoryData(newState);
    };

    const addNewCategory = (data: any) => {
      let obj = categoryData.find(
        (o: any) => o.category_id == data.category_id
      );
      obj
        ? updateState()
        : setCategoryData((prev) => [
            ...prev,
            {
              margin: "0%",
              category_id: data.category_id,
              change: "no",
              subcategories: [
                {
                  subcategory_id: data.subcategory_id,
                  margin: data.margin + "%",
                  change: data.change,
                },
              ],
            },
          ]);
    };

    categoryData.length > 0
      ? addNewCategory(data)
      : setCategoryData([
          {
            margin: "0%",
            category_id: data.category_id,
            change: "no",
            subcategories: [
              {
                subcategory_id: data.subcategory_id,
                margin: data.margin + "%",
                change: data.change,
              },
            ],
          },
        ]);
  };

  return (
    <MainContainer>
      <Container>
        <Typography variant="h5">Add Category</Typography>
        <Card className="lg:col-span-2">
          <CardContent sx={{ pt: 2 }}>
            {categoryData.length > 0 ? (
              <SelectedCategoryData
                CategoryData={categoryData}
                changeCategoryData={categoryHandler}
              />
            ) : null}
            <CategoryForm
              CategoryData={categoryData}
              changeCategoryData={categoryHandler}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                my: 2,
                flexFlow: "row-reverse",
              }}
            >
              <Button
                // type="submit"
                color="secondary"
                variant="contained"
                disabled={categoryData.length > 0 ? false : true}
                startIcon={
                  loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : undefined
                }
                onClick={shopCategorySaveHandler}
              >
                Save
              </Button>
              <LinkRouter to={-1}>
                <Button color="secondary" variant="outlined">
                  Close
                </Button>
              </LinkRouter>
            </Box>
            {/* </form> */}
          </CardContent>
        </Card>
      </Container>
    </MainContainer>
  );
}
