import React from "react";
import { Box } from "@mui/material";
import { MainContainer } from "../../../../components/layout";
import RetailerListResults from "../../../../components/admin/retailers/retailers-list-results";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import { useNavigate } from "react-router-dom";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import { retailer } from "../../../../http";
import { retailerFields } from "../../../../constants";

export default function Retailers() {
  const [searchText, setSearchText] = React.useState("");
  const navigate = useNavigate();

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_retailer=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await retailer("get", {
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
        title="Retailers"
        onSearch={searchHandler}
        onAddProps={{
          title: "Add Retailer",
          onClick() {
            navigate("new");
          },
        }}
        exportProps={{
          ref,
          data: csvData,
          filename: `retailer-csv`,
          onClick: exportHandle,
          headers: retailerFields,
        }}
      />
      <Box sx={{ mt: 2 }}>
        <RetailerListResults searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
