import React from "react";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import TrendingProductList from "../../../../components/admin/products/trending-product/trending-products-list";
import ProductsListToolbar from "../../../../components/admin/products/products-list-toolbar";
import { MainContainer } from "../../../../components/layout";
import {
  addSno,
  queryToStr,
  removeEsc,
} from "../../../../components/admin/utils";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { shopProducts } from "../../../../http";
import { productFields } from "../../../../constants";

export default function TrendingProducts() {
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

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
        params: "trending",
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
        title="Trending Products"
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `trending-product-csv`,
          onClick: exportHandle,
          headers: productFields,
        }}
      />
      <Box sx={{ mt: 2 }}>
        <TrendingProductList searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
