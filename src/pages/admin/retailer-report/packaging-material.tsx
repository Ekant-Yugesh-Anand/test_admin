import Box from "@mui/material/Box";
import React from "react";
import { useDispatch } from "react-redux";
import CommonToolbar from "../../../components/admin/common-toolbar";
import PackagingMaterialReportList from "../../../components/admin/retailer-report/packaging-material-list";
import { addSno, dateTimeFormatTable, removeEsc } from "../../../components/admin/utils";
import { MainContainer } from "../../../components/layout";
import { packagingMaterialFields } from "../../../constants";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { shopRetailerMaterialPackage } from "../../../http/server-api/server-apis";
import { setPageLoading } from "../../../redux/slices/admin-slice";

export default function PackagingMaterialReport() {
    const dispatch = useDispatch()
    const ref = React.useRef<any>(null);
    const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);

    const exportHandler = async () => {
        try {
          dispatch(setPageLoading(true));
          const res = await shopRetailerMaterialPackage("get");
          if (res?.status === 200) {
            let csvData = res.data || [];
            // indexing
            csvData = addSno(csvData);
            // for order date
            csvData = dateTimeFormatTable(csvData, "issue_date", "issue_time");
         
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
        title="Packaging Material Report"  
        exportProps={{
            ref,
            data: csvData,
            headers: packagingMaterialFields,
            filename:"packaging-material-report",
            onClick: exportHandler,
          }}
      />
      <Box sx={{ mt: 3 }}>
        <PackagingMaterialReportList searchText="" />
      </Box>
    </MainContainer>
  );
}


