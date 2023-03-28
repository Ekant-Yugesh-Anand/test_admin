import React from "react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Divider,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { TextInput } from "../../form";
import {
  categories as categoriesHttp,
  subCategories as subCategoriesHttp,
} from "../../../http";
import AsyncAutocomplete from "../../form/async-autocomplete";
import { queryToStr } from "../utils";
import { categorySchema } from "./schemas";
import { useParams } from "react-router-dom";

export default function CategoryForm(porps: {
  CategoryData: Array<{ [key: string]: any }>;
  changeCategoryData: (data: any, del: boolean) => void;
}) {
  const { retailer_id } = useParams();
  const { changeCategoryData } = porps;
  const [categories, setCategories] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [subCategories, setSubCategories] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
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
    validationSchema: categorySchema,
    onSubmit(values) {
      changeCategoryData(values, false);
    },
  });

  const { isLoading: categoryLoading } = useQuery(
    ["all-category-retailer", retailer_id],
    () =>
      categoriesHttp("get", {
        params: "categories",
        postfix: "?".concat(
          queryToStr({
            retailer_id,
          })
        ),
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setCategories(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: subcategoryLoading } = useQuery(
    ["all-subcategory-retailer", values.category_id],
    () =>
      subCategoriesHttp("get", {
        params: "subcategories",
        postfix: "?".concat(
          queryToStr({ category_id: values.category_id || 0, retailer_id })
        ),
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setSubCategories(data.data instanceof Array ? data.data : []);
      },
    }
  );

  return (
    <Box>
      <Box sx={{ my: 2 }}>
        <Box>
          <Typography variant={"h6"}>Select Category</Typography>
          <Typography>Add margin as per subcategory </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Box sx={{ my: 1 }}>
              <AsyncAutocomplete
                id="category-option"
                loading={categoryLoading}
                label="Category"
                options={categories || []}
                objFilter={{
                  title: "name",
                  value: "category_id",
                }}
                value={values?.category_id}
                onChangeOption={(value) => {
                  setFieldValue("category_id", value);
                  setFieldValue("subcategory_id", "");
                }}
                TextInputProps={{
                  error:
                    errors["category_id"] && touched["category_id"]
                      ? true
                      : false,
                  helperText: touched["category_id"]
                    ? errors["category_id"]
                    : "",
                  onBlur: handleBlur,
                }}
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <AsyncAutocomplete
                id="sub-category-option"
                loading={subcategoryLoading}
                label="Sub Category"
                options={subCategories || []}
                objFilter={{
                  title: "name",
                  value: "category_id",
                }}
                value={values?.subcategory_id}
                onChangeOption={(value) =>
                  setFieldValue("subcategory_id", value)
                }
                TextInputProps={{
                  error:
                    errors["subcategory_id"] && touched["subcategory_id"]
                      ? true
                      : false,
                  helperText: touched["subcategory_id"]
                    ? errors["subcategory_id"]
                    : "",
                  onBlur: handleBlur,
                }}
              />
            </Box>
            <TextInput
              type="text"
              label="Margin"
              name="margin"
              placeholder="Add margin (%)"
              value={values.margin || ""}
              onChange={handleChange}
              error={errors.margin && touched.margin ? true : false}
              helperText={touched.margin ? errors.margin : ""}
              onBlur={handleBlur}
            />
            <Box sx={{ my: 2 }}>
              <Typography
                component={"label"}
                sx={{ display: "block", color: "#6b7280", fontWeight: 600 }}
              >
                Change Existing Product Margin
              </Typography>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="change"
                value={values.change}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio color="secondary" />}
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio color="secondary" />}
                  label="No"
                />
              </RadioGroup>
            </Box>
          </div>
          <Box
            sx={{
              my: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Button color="secondary" variant="outlined" type="submit">
              Add More
            </Button>
          </Box>
        </form>
      </Box>
      <Divider />
    </Box>
  );
}

export const initialValues = {
  category_id: "",
  subcategory_id: "",
  margin: "",
  change: "no",
};
