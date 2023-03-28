import React from "react";
import { MainContainer } from "../../../components/layout";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { shopProducts } from "../../../http";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import CommonToolbar from "../../../components/admin/common-toolbar";
import DataSkuUnitList from "../../../components/admin/retailer-report/data-sku-unit-list";
import { addSno, removeEsc } from "../../../components/admin/utils";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { dataSkuFields } from "../../../constants";

export default function DataSkuUnit() {
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);

  const searchHandler = async (value: string) =>
    setSearchText(value ? `/searchproduct?search_products=${value}` : "");

  const dispatch = useDispatch();

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopProducts("get", {
        postfix: searchText,
      });
      if (res?.status === 200) {
        let csvData = res.data;
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
        title="Data SKU Unit"
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `data-sku-unit-csv`,
          onClick: exportHandle,
          headers: dataSkuFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <DataSkuUnitList searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
