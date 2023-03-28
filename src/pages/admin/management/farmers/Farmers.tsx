import React from "react";
import { MainContainer } from "../../../../components/layout";
import { Box } from "@mui/material";
import { farmers } from "../../../../http";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import FarmersListResults from "../../../../components/admin/farmers/farmers-list-results";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import { farmersFields } from "../../../../constants";

export default function Farmers() {
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const searchHandler = async (value: string) => {
    setSearchText(value ? `/search?search_customer=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await farmers("get", {
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
        title="Farmers"
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `farmers-csv`,
          onClick: exportHandle,
          headers: farmersFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <FarmersListResults searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
