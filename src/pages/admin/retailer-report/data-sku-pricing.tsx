import React from "react";
import { MainContainer } from "../../../components/layout";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { shopAssignRetailerProducts } from "../../../http";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import CommonToolbar from "../../../components/admin/common-toolbar";
import DataSkuPricingList from "../../../components/admin/retailer-report/data-sku-pricing-list";
import { addSno, removeEsc } from "../../../components/admin/utils";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { dataSkuPriceFields } from "../../../constants";

export default function DataSkuPricing() {
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);

  const searchHandler = async (value: string) => {
    setSearchText(value ? `/search?search_product=${value}` : "");
  };

  const dispatch = useDispatch();

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopAssignRetailerProducts("get", {
        postfix: searchText,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
        // indexing
        csvData = addSno(csvData);

        // remove esc
        csvData = removeEsc(csvData);

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
      <CommonToolbar
        title="Data SKU Pricing"
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `data-sku-pricing-csv`,
          onClick: exportHandle,
          headers: dataSkuPriceFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <DataSkuPricingList searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
