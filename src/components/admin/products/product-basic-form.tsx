import React from "react";
import { FormikErrors } from "formik";
import { useQuery } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";
import { Box, Typography, Divider } from "@mui/material";
import { TextInput } from "../../form";
import {
  categories as categoriesHttp,
  subCategories as subCategoriesHttp,
  brands as brandsHttp,
  crops,
  shopChemical,
} from "../../../http";
import AsyncAutocomplete from "../../form/async-autocomplete";
import { queryToStr } from "../utils";
import WebInput from "../../form/inputs/WebInput";
import { shopIngredients } from "../../../http/server-api/server-apis";

export default function ProductBasicForm(props: {
  errors?: any;
  values?: any;
  touched?: any;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  handleBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) =>
    | Promise<void>
    | Promise<
        FormikErrors<{
          [key: string]: any;
        }>
      >;
}) {
  const { values, handleChange, errors, handleBlur, touched, setFieldValue } =
    props;
  const [brands, setBrands] = React.useState<Array<{ [key: string]: any }>>([]);
  const [cropsData, setCropsData] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [chemicalData, setChemicalData] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [ingredientsData, setIngredientsData] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [categories, setCategories] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [subCategories, setSubCategories] = React.useState<
    Array<{ [key: string]: any }>
  >([]);

  const basicFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "SKU Name",
        name: "sku_name",
        placeholder: "SKU Name",
      },
      {
        type: "text",
        label: "SKU Name Kannada",
        name: "sku_name_kannada",
        placeholder: "SKU Name Kannada",
      },
      {
        type: "text",
        label: "SKU Code",
        name: "sku_code",
        placeholder: "SKU Code",
      },
      {
        type: "numeric",
        label: "HSN Code",
        name: "hsn_code",
        placeholder: "HSN Code",
      },
      {
        type: "WebInput",
        label: "Description",
        name: "description",
        placeholder: "Description",
        multiline: true,
        rows: 4,
      },
      {
        type: "WebInput",
        label: "Ingredients",
        name: "ingredients",
        placeholder: "Ingredients",
        multiline: true,
        rows: 4,
      },
      {
        type: "WebInput",
        label: "Technical Formula",
        name: "technical_formula",
        placeholder: "Technical Formula",
        multiline: true,
        rows: 4,
      },
      {
        type: "WebInput",
        label: "Doses",
        name: "doses",
        placeholder: "Doses",
        multiline: true,
        rows: 4,
      },
      {
        type: "WebInput",
        label: "Application",
        name: "application",
        placeholder: "application",
        multiline: true,
        rows: 4,
      },
      {
        type: "WebInput",
        label: "Target Crop",
        name: "target_crop",
        placeholder: "Target Crop",
        multiline: true,
        rows: 4,
      },
    ],
    []
  );

  const { isLoading: brandLoading } = useQuery(
    ["get-all-brands"],
    () =>
      brandsHttp("get", {
        params: "brands",
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setBrands(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: cropLoading } = useQuery(
    ["get-all-crops"],
    () =>
      crops("get", {
        params: "crops",
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setCropsData(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: chemicalLoading } = useQuery(
    ["get-all-chemical"],
    () =>
      shopChemical("get", {
        params: "chemicals",
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setChemicalData(
            data.data?.chemicals instanceof Array ? data.data?.chemicals : []
          );
      },
    }
  );

  const { isLoading: ingredientLoading } = useQuery(
    ["get-all-ingredients"],
    () =>
      shopIngredients("get", {
        params: "ingredients",
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setIngredientsData(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: categoryLoading } = useQuery(
    ["get-all-categories"],
    () => categoriesHttp("get", { params: "categories" }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setCategories(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: subcategoryLoading } = useQuery(
    ["get-all-subcategories", values.category_id],
    () =>
      subCategoriesHttp("get", {
        params: "subcategories",
        postfix: "?".concat(
          queryToStr({ category_id: values.category_id || 0 })
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
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>Basic Information</Typography>
          <Typography>Section to config basic product information</Typography>
        </Box>
        {basicFields.map((item, index) => {
          const { type, ...others } = item;

          if (type === "WebInput") {
            return (
              <WebInput
                key={index}
                label={item.label}
                value={values[item.name] ? values[item.name] : ""}
                onChangeOption={(value) => setFieldValue(item.name, value)}
                error={errors[item.name]}
                helperText={touched[item.name] ? errors[item.name] : ""}
                onBlur={handleBlur}
               
              />
            );
          }
          return type === "numeric" ? (
            <NumericFormat
              key={index}
              {...others}
              value={values[item.name]}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
              customInput={TextInput}
            />
          ) : (
            <TextInput
              key={index}
              {...item}
              value={values[item.name] || ""}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          );
        })}
      </Box>
      <Divider />
      <Box sx={{ my: 2 }}>
        <Box>
          <Typography variant={"h6"}>Organizations</Typography>
          <Typography>Section to config the product attribute</Typography>
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Box sx={{ my: 1 }}>
            <AsyncAutocomplete
              id="category-option"
              loading={categoryLoading}
              label="Categories"
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
                helperText: touched["category_id"] ? errors["category_id"] : "",
                onBlur: handleBlur,
              }}
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <AsyncAutocomplete
              id="sub-category-option"
              loading={subcategoryLoading}
              label="Sub Categories"
              options={subCategories || []}
              objFilter={{
                title: "name",
                value: "category_id",
              }}
              value={values?.subcategory_id}
              onChangeOption={(value) => setFieldValue("subcategory_id", value)}
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
          <Box sx={{ my: 1 }}>
            <AsyncAutocomplete
              id="brand-option"
              loading={brandLoading}
              label="Brands"
              options={brands}
              objFilter={{
                title: "brand_name",
                value: "brand_id",
              }}
              value={values?.brand_id}
              onChangeOption={(value) => setFieldValue("brand_id", value)}
              TextInputProps={{
                error: errors["brand_id"] && touched["brand_id"] ? true : false,
                helperText: touched["brand_id"] ? errors["brand_id"] : "",
                onBlur: handleBlur,
              }}
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <AsyncAutocomplete
              id="crop-option"
              multiple={true}
              loading={cropLoading}
              label="Crops"
              options={cropsData || []}
              objFilter={{
                title: "crop_name",
                value: "crop_id",
              }}
              value={values?.crop_id || ""}
              onChangeOption={(value) => setFieldValue("crop_id", value)}
              TextInputProps={{
                error: errors["crop_id"] && touched["crop_id"] ? true : false,
                helperText: touched["crop_id"] ? errors["crop_id"] : "",
                onBlur: handleBlur,
              }}
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <AsyncAutocomplete
              id="ingredient-option"
              multiple={true}
              loading={ingredientLoading}
              label="Ingredients"
              options={ingredientsData || []}
              objFilter={{
                title: "ingredient_name",
                value: "ingredient_id",
              }}
              value={values?.ingredient_id || ""}
              onChangeOption={(value) => {
                setFieldValue("ingredient_id", value);
              }}
              TextInputProps={{
                error:
                  errors["ingredient_id"] && touched["ingredient_id"]
                    ? true
                    : false,
                helperText: touched["ingredient_id"]
                  ? errors["ingredient_id"]
                  : "",
                onBlur: handleBlur,
              }}
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <AsyncAutocomplete
              id="chemical-option"
              multiple={true}
              loading={chemicalLoading}
              label="Chemicals"
              options={chemicalData || []}
              objFilter={{
                title: "name",
                value: "id",
              }}
              value={values?.chemical_id || ""}
              onChangeOption={(value) => {
                setFieldValue("chemical_id", value);
              }}
              TextInputProps={{
                error:
                  errors["chemical_id"] && touched["chemical_id"]
                    ? true
                    : false,
                helperText: touched["chemical_id"]
                  ? errors["chemical_id"]
                  : "",
                onBlur: handleBlur,
              }}
            />
          </Box>
        </div>
      </Box>
    </Box>
  );
}

export const initialValues = {
  sku_name: "",
  sku_name_kannada: "",
  sku_code: "",
  hsn_code: "",
  description: "",
  //   organization
  category_id: "",
  subcategory_id: "",
  brand_id: "",
  crop_id: "",
  ingredient_id: "",
  technical_formula: "",
  doses: "",
  application: "",
  target_crop: "",
  chemical_id:""
};
