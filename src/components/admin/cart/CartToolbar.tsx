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
import RowSearch from "../../table/row-search";
import AsyncAutocomplete from "../../form/async-autocomplete";
import { useQuery } from "@tanstack/react-query";
import PageBack from "../../layout/page-back";
import { shopCart } from "../../../http/server-api/server-apis";

export default function CartToolbar(props: {
  title?: string;
  onClickSort?: () => void;
  onSearch: (
    value: string,
    customer_id?: number,
    retialer_id?: number,
    sku_id?: number
  ) => void;
  onImport?: () => void;
  onAdd?: () => void;
  filter?: boolean;
  deleted: string;
  exportProps?: {
    ref?: any;
    headers?: Headers;
    onClick?: () => void;
    data: string | Data | (() => string | Data);
    filename?: string;
  };
}) {
  const {
    onSearch,
    exportProps,
    title,
    onClickSort,
    onImport,
    onAdd,
    filter,
    deleted,
  } = props;

  const [searchText, setSearchText] = React.useState("");
  const [customerId, setCustomerId] = React.useState(0);
  const [retailerId, setRetailerId] = React.useState(0);
  const [skuId, setSkuId] = React.useState(0);

  const [customers, setCustomers] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [retailers, setRetailers] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [skuList, setSkuList] = React.useState<Array<{ [key: string]: any }>>(
    []
  );

  const { isLoading: customerLoading } = useQuery(
    ["cart-customer", deleted],
    () =>
      shopCart("get", {
        params: "filter",
        postfix: `?deleted=${deleted}&type=customers`,
      }),

    {
      onSuccess(data) {
        if (data?.status === 200)
          setCustomers(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: retailerLoading } = useQuery(
    ["cart-retailer", deleted],
    () =>
      shopCart("get", {
        params: "filter",
        postfix: `?deleted=${deleted}&type=retailers`,
      }),

    {
      onSuccess(data) {
        if (data?.status === 200)
          setRetailers(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const { isLoading: skuLoading } = useQuery(
    ["cart-sku", deleted],
    () =>
      shopCart("get", {
        params: "filter",
        postfix: `?deleted=${deleted}&type=products`,
      }),

    {
      onSuccess(data) {
        if (data?.status === 200)
          setSkuList(data.data instanceof Array ? data.data : []);
      },
    }
  );
  const onReset = () => {
    setSearchText("");
    onSearch("");
    setCustomerId(0);
    setRetailerId(0);
    setSkuId(0);
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
                        id="customer-option"
                        loading={customerLoading}
                        label="Farmers"
                        options={customers}
                        objFilter={{
                          title: "customer_name",
                          value: "customer_id",
                        }}
                        value={customerId}
                        onChangeOption={(value) => {
                          setCustomerId(value);
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ minWidth: 220 }}>
                      <AsyncAutocomplete
                        id="retailer-option"
                        loading={retailerLoading}
                        label="Retailer"
                        options={retailers}
                        objFilter={{
                          title: "retailer_name",
                          value: "retailer_id",
                        }}
                        value={retailerId}
                        onChangeOption={(value) => {
                          setRetailerId(value);
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ minWidth: 220 }}>
                      <AsyncAutocomplete
                        id="sku-option"
                        loading={skuLoading}
                        label="Products"
                        options={skuList}
                        objFilter={{
                          title: "sku_name",
                          value: "sku_id",
                        }}
                        value={skuId}
                        onChangeOption={(value) => {
                          setSkuId(value);
                        }}
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
                onClick={() => onSearch(searchText, customerId, retailerId, skuId)}
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
