import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import { crops } from "../../../../http";
import {  cropFields } from "../../../../constants";
import {useNavigate} from "react-router-dom"
import CropsListResult from "../../../../components/admin/crops/CropsListResult";

export default function Crops() {
  const navigate= useNavigate()
  const [searchText, setSearchText] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onSortOpen = () => setSortOpen(true);
  const onSortClose = () => setSortOpen(false);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_crop=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await crops("get", {
        params: "crops",
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
        onAddProps={{
          title: "Add Crop",
          onClick: onAdd,
        }}
        title="Crops"
        onSearch={searchHandler}
        // onImport={() => navigate("crop-csv-import")}
        exportProps={{
          ref,
          data: csvData,
          filename: `crop-csv`,
          onClick: exportHandle,
          headers: cropFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <CropsListResult
          searchText={searchText}
          addOpen={open}
          addClose={onClose}
          sortOpen={sortOpen}
          onSortClose={onSortClose}
        />
      </Box>
    </MainContainer>
  );
}
