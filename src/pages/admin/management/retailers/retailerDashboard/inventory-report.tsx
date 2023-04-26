import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box} from "@mui/material";
import { MainContainer } from "../../../../../components/layout";
import { retailer, shopAssignRetailerProducts } from "../../../../../http";
import useStateWithCallback from "../../../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../../redux/slices/admin-slice";
import {
  addSno,
  getQunatityInStock,
  queryToStr,
  removeEsc,
} from "../../../../../components/admin/utils";
import ProductsListToolbar from "../../../../../components/admin/products/products-list-toolbar";
import InventoryDetailList from "../../../../../components/admin/retailers/inventory-detail-list";
import { inventoryFields } from "../../../../../constants";

export default function RetailerSkuPricingUnits() {
  const { retailer_id } = useParams();
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();
  const navigate= useNavigate()

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "";
  }, [data]);

  const searchHandler = async (
    value: string,
    category_id?: number,
    subcategory_id?: number
  ) => {
    setSearchText(
      `/search` +
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
        postfix: searchText
          ? `${searchText}&retailer_id=${retailer_id}`
          : `?retailer_id=${retailer_id}`,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
        // indexing
        csvData = addSno(csvData);

        // remove esc
        csvData = removeEsc(csvData);
        // calculate qty_in_stock
        csvData = getQunatityInStock(csvData)
        

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

  return (
    <MainContainer>
      <ProductsListToolbar
        title={`${retailerName} / Inventory Report`}
        onSearch={searchHandler}
        onImport={() => navigate("inventory-csv-import")}
        exportProps={{
          ref,
          data: csvData,
          filename: `retailer-sku-pricing-csv`,
          onClick: exportHandle,
          headers: inventoryFields,
        }}
        retailer_id={retailer_id as string}
      />
      <Box sx={{ mt: 3 }}>
        <InventoryDetailList searchText={searchText}   />
      </Box>
    </MainContainer>
  );
}
