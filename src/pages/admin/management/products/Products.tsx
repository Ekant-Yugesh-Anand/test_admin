import React, { ChangeEvent } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductsListResults from "../../../../components/admin/products/products-list-results";
import ProductsListToolbar from "../../../../components/admin/products/products-list-toolbar";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { MainContainer } from "../../../../components/layout";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import {
  addSno,
  queryToStr,
  removeEsc,
} from "../../../../components/admin/utils";
import { productFields } from "../../../../constants";
import { shopProducts } from "../../../../http";
import MultipleImageUpload from "./MultipleImageUpload";



export default function Products() {
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const [sortOpen, setSortOpen] = React.useState(false);
  const onSortOpen = () => setSortOpen(true);
  const onSortClose = () => setSortOpen(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchHandler = (
    value: string,
    category_id?: number,
    subcategory_id?: number
  ) => {
    setSearchText(
      "?" +
      queryToStr({
        category_id: typeof category_id !== "undefined" ? category_id : 0,
        subcategory_id:
          typeof subcategory_id !== "undefined" ? subcategory_id : 0,
        ...(value ? { search_products: value } : {}),
      })
    );
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopProducts("get", {
        params:"allcsv",
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
      <ProductsListToolbar
        onSearch={searchHandler}
        onClickSort={onSortOpen}
        onAdd={() => navigate("new")}
        onImport={() => navigate("product-csv-import")}
        exportProps={{
          ref,
          data: csvData,
          filename: `products-csv`,
          onClick: exportHandle,
          headers: productFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <ProductsListResults
          searchText={searchText}
          sortOpen={sortOpen}
          onSortClose={onSortClose}
        />
      </Box>
    

    </MainContainer>
  );
}
