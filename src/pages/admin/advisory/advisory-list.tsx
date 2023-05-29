import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { MainContainer } from "../../../components/layout";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import { addSno, removeEsc } from "../../../components/admin/utils";
import { crops } from "../../../http";
import CommonToolbar from "../../../components/admin/common-toolbar";
import AdvisoryListResult from "../../../components/admin/advisory/AdvisoryListResult";

export default function AdvisoryPackage() {
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

  const onSortClose = () => setSortOpen(false);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_crop=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await crops("get", {
        params: "advisory",
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
        title="Advisory Package"
        onSearch={searchHandler}
        onAddProps={{
          title: "Add Package",
          onClick: onAdd,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <AdvisoryListResult
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
