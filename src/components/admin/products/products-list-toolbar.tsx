import React from "react";
import { CSVLink } from "react-csv";
import { FaFileCsv } from "react-icons/fa";
import { Data, Headers } from "react-csv/components/CommonPropTypes";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  categories as categoriesHttp,
  subCategories as subCategoriesHttp,
  shopRetailerCategories as shopRetailerHttp,
} from "../../../http";
import RowSearch from "../../table/row-search";
import AsyncAutocomplete from "../../form/async-autocomplete";
import { useQuery } from "@tanstack/react-query";
import { queryToStr } from "../utils";
import PageBack from "../../layout/page-back";

export default function ProductsListToolbar(props: {
  title?: string;
  onClickSort?: () => void;
  onSearch: (value: string, category?: number, subcategory?: number) => void;
  onImport?: () => void;
  onAdd?: () => void;
  filter?: boolean;
  exportProps?: {
    ref?: any;
    headers?: Headers;
    onClick?: () => void;
    data: string | Data | (() => string | Data);
    filename?: string;
  };
  retailer_id?: string;
}) {
  const {
    onSearch,
    exportProps,
    title,
    onClickSort,
    onImport,
    onAdd,
    filter,
    retailer_id,
  } = props;

  const [searchText, setSearchText] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(0);
  const [subcategoryId, setSubcategoryId] = React.useState(0);

  const [categories, setCategories] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [subCategories, setSubCategories] = React.useState<
    Array<{ [key: string]: any }>
  >([]);

  const { isLoading: categoryLoading } = useQuery(
    ["get-all-categories", retailer_id ? retailer_id : ""],
    () =>
      retailer_id
        ? shopRetailerHttp("get", {
            params: "categories",
            postfix: `?retailer_id=${retailer_id}&active=1`,
          })
        : categoriesHttp("get", { params: "retailer/categories" }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setCategories(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: subcategoryLoading } = useQuery(
    ["get-all-subcategories", categoryId, retailer_id ? retailer_id : ""],
    () =>
      retailer_id
        ? shopRetailerHttp("get", {
            params: "subcategories",
            postfix: "?".concat(
              queryToStr({
                category_id: categoryId || 0,
                retailer_id,
                active: "1",
              })
            ),
          })
        : subCategoriesHttp("get", {
            params: "retailer/subcategories",
            postfix: "?".concat(queryToStr({ category_id: categoryId || 0 })),
          }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setSubCategories(data.data instanceof Array ? data.data : []);
      },
    }
  );

  const onReset = () => {
    setSearchText("");
    onSearch("");
    setCategoryId(0);
    setSubcategoryId(0);
  };

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h5">
          {title ? title : "Products"}
        </Typography>
        <Box sx={{ m: 1 }}>
          {onImport && (
            <Button
              color="secondary"
              startIcon={<FaFileCsv fontSize="small" />}
              sx={{ mr: 1 }}
              size="small"
              onClick={onImport}
            >
              Import
            </Button>
          )}
          {exportProps && (
            <>
              <CSVLink
                data={exportProps.data}
                headers={exportProps.headers}
                filename={exportProps?.filename}
                target="_blank"
                ref={exportProps.ref}
              />
              <Button
                sx={{ mr: 1 }}
                color="secondary"
                onClick={exportProps?.onClick}
                size="small"
                startIcon={<FaFileCsv fontSize="small" />}
              >
                Export
              </Button>
            </>
          )}
          {onClickSort && (
            <Button
              sx={{ mr: 1 }}
              color="secondary"
              variant="outlined"
              onClick={onClickSort}
              size="small"
            >
              Sort
            </Button>
          )}
          {onAdd && (
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={onAdd}
            >
              Add Product
            </Button>
          )}
          <PageBack />
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Card>
          <CardContent sx={{ display: "flex" }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item>
                <RowSearch
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search"
                />
              </Grid>
              {!filter && (
                <>
                  <Grid item>
                    <Box sx={{ minWidth: 220 }}>
                      <AsyncAutocomplete
                        id="category-option"
                        loading={categoryLoading}
                        label="Category"
                        options={[
                          { name: "All", category_id: 0 },
                          ...categories,
                        ]}
                        objFilter={{
                          title: "name",
                          value: "category_id",
                        }}
                        value={categoryId}
                        onChangeOption={(value) => {
                          setCategoryId(value);
                          setSubcategoryId(0);
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ minWidth: 220 }}>
                      <AsyncAutocomplete
                        id="sub-category-option"
                        loading={subcategoryLoading}
                        label="Sub Category"
                        options={[
                          { name: "All", category_id: 0 },
                          ...subCategories,
                        ]}
                        objFilter={{
                          title: "name",
                          value: "category_id",
                        }}
                        value={subcategoryId}
                        onChangeOption={(value) => setSubcategoryId(value)}
                      />
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid
              sx={{
                display: "flex",
                gap: 3,
                alignItems: "center",
              }}
            >
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={() => onSearch(searchText, categoryId, subcategoryId)}
              >
                Search
              </Button>
              <Button
                sx={{
                  borderColor: "neutral.200",
                  color: "neutral.600",
                  "&:hover": {
                    borderColor: "neutral.300",
                    color: "neutral.800",
                  },
                }}
                variant="outlined"
                size="small"
                onClick={onReset}
              >
                Reset
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
