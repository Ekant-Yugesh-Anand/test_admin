import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import { useNavigate } from "react-router-dom";
import {
  shopChemical,
} from "../../../../http/server-api/server-apis";
import ChemicalListResult from "../../../../components/admin/Chemical/chemical-list-result";
import { chemicalFields } from "../../../../constants";

export default function Chemicals() {
  const [searchText, setSearchText] = React.useState("");

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_ingredient=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopChemical("get", {
        params: "chemicals",
        postfix: searchText,
      });
      if (res?.status === 200) {
        let csvData = res.data?.chemicals || [];
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
        title="Chemicals"
        exportProps={{
          ref,
          data: csvData,
          filename: `chemical-csv`,
          onClick: exportHandle,
          headers: chemicalFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <ChemicalListResult searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
