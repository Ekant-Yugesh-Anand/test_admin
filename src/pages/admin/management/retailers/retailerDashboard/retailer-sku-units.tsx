import React from "react";
import { Box, Card, CardContent } from "@mui/material";
import { useParams } from "react-router-dom";
import { MainContainer } from "../../../../../components/layout";
import {
  RetailerSkuListResults,
  RetailerSkuUnitTab,
} from "../../../../../components/admin/retailers/retailer-sku-units";
import { useQuery } from "@tanstack/react-query";
import { retailer, shopAssignRetailerProducts } from "../../../../../http";
import useStateWithCallback from "../../../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../../redux/slices/admin-slice";
import { addSno, queryToStr } from "../../../../../components/admin/utils";
import { retailerSKUPricingFields } from "../../../../../constants/fields/retailer-fields";
import { useNavigate } from "react-router-dom";
import ProductsListToolbar from "../../../../../components/admin/products/products-list-toolbar";

export default function RetailerSkuUnits() {
  const navigate = useNavigate();
  const { retailer_id } = useParams();
  const [productTab, setProductTab] = React.useState(0);
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "";
  }, [data]);
  const searchHandler = (
    value: string,
    category_id?: number,
    subcategory_id?: number
  ) => {
    setSearchText(
      `/${productTab === 0 ? "search" : "unassingn_search"}` +
        "?" +
        queryToStr({
          category_id: typeof category_id !== "undefined" ? category_id : 0,
          subcategory_id:
            typeof subcategory_id !== "undefined" ? subcategory_id : 0,
          ...(value ? { search_product: value } : {}),
        })
    );
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopAssignRetailerProducts("get", {
        params: productTab === 0 ? "" : searchText ? "" : "unassign",
        postfix: searchText
          ? `${searchText}&retailer_id=${retailer_id}`
          : `?retailer_id=${retailer_id}`,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
        // indexing
        csvData = addSno(csvData);

        setCsvData(csvData, () => {
          ref.current.link.click();
          dispatch(setPageLoading(false));
        });
      }
    } catch (error) {
      console.log(error);
      dispatch(setPageLoading(false));
    }
  };

  React.useEffect(() => {
    setSearchText("");
  }, [productTab]);

  return (
    <>
      <RetailerSkuUnitTab onChange={setProductTab} value={productTab} />
      <MainContainer >
        <Box sx={{ mt: 10 }}>
          {productTab != 0 ? (
            <ProductsListToolbar
              title={`${retailerName} / Retailer Sku`}
              onSearch={searchHandler}
              onImport={() => navigate("retailer-sku-import")}
              exportProps={{
                ref,
                data: csvData,
                filename: `retailer-sku-${
                  productTab === 0 ? "assign" : "unassign"
                }-csv`,
                onClick: exportHandle,
                headers: retailerSKUPricingFields,
              }}
              retailer_id={retailer_id as string}
            />
          ) : (
            <ProductsListToolbar
              title={`${retailerName} / Retailer Sku`}
              onSearch={searchHandler}
              exportProps={{
                ref,
                data: csvData,
                filename: `retailer-sku-${
                  productTab === 0 ? "assign" : "unassign"
                }-csv`,
                onClick: exportHandle,
                headers: retailerSKUPricingFields,
              }}
              retailer_id={retailer_id as string}
            />
          )}
          <Card sx={{ mt: 1 }}>
            <CardContent sx={{ minHeight: 180 }}>
              <RetailerSkuListResults
                key={productTab}
                searchText={searchText}
                variant={productTab === 0 ? "assign" : "unassign"}
                retailerId={retailer_id as string}
              />
            </CardContent>
          </Card>
        </Box>
      </MainContainer>
    </>
  );
}
