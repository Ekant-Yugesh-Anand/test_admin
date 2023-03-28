import React from "react";
import { Box } from "@mui/material";
import { MainContainer } from "../../../../components/layout";
import CategoriesListResults from "../../../../components/admin/categories/categories-list-results";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { categories } from "../../../../http";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import { categoryFields } from "../../../../constants";

export default function Categories() {
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
    setSearchText(value ? `/search?search_category=${value}` : "");
  };
  
  // categorydata export 
 
  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await categories("get", {
        params:"categories",
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
          title: "Add Category",
          onClick: onAdd,
        }}
        onClickSort={onSortOpen}
        title={`Categories`}
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `categories-csv`,
          onClick: exportHandle,
          headers: categoryFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <CategoriesListResults
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
