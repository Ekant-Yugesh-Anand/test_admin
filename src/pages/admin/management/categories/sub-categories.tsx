// subcategories
import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainContainer } from "../../../../components/layout";
import { categories, subCategories } from "../../../../http";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import SubCategoriesList from "../../../../components/admin/categories/sub-categories-list";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { subCategoryFields } from "../../../../constants";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { addSno, removeEsc } from "../../../../components/admin/utils";

export default function SubCategories() {
  const { parent_category_id } = useParams();
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

  const searchHandler = (value: string) =>
    setSearchText(value ? `/search?search_category=${value}` : "");

  const { data } = useQuery(["category-name"], () =>
    categories("get", { params: parent_category_id })
  );

  const categoryName = React.useMemo(() => {
    if (data?.status) return data.data?.name;
    return "";
  }, [data]);

    // sub-categorydata export 

    const exportHandle = async () => {
      try {
        dispatch(setPageLoading(true));
        const res = await subCategories("get", {
          params:`subcategories?category_id=${parent_category_id}`,
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
          title: "Add Sub Category",
          onClick: onAdd,
        }}
        title={`${categoryName} / Sub-Categories`}
        onSearch={searchHandler}
        onClickSort={onSortOpen}
        exportProps={{
          ref,
          data: csvData,
          filename: `sub-categories-csv`,
          onClick: exportHandle,
          headers: subCategoryFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <SubCategoriesList
          searchText={searchText}
          addOpen={open}
          addClose={onClose}
          categoryId={parent_category_id as string}
          sortOpen={sortOpen}
          onSortClose={onSortClose}
        />
      </Box>
    </MainContainer>
  );
}
