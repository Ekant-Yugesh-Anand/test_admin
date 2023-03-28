import React from "react";
import { Box } from "@mui/material";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import { useNavigate, useParams } from "react-router-dom";
import { categories, retailer } from "../../../../http";
import { useQuery } from "@tanstack/react-query";
import RetailerSubCategoryList from "../../../../components/admin/retailers/retailer-subcat-list-result";

export default function RetailerSubCategory() {
  const {  category_id } = useParams();
  const [searchText, setSearchText] = React.useState("");

  const { data: categoryData } = useQuery(["category-name", category_id], () =>
    categories("get", { params: category_id })
  );

  const categoryName = React.useMemo(() => {
    if (categoryData?.status) return categoryData.data?.name;
    return "";
  }, [categoryData]);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_retailer=${value}` : "");
  };

  return (
    <MainContainer>
      <CommonToolbar
        title={`${categoryName}/SubCategory`}
        // onSearch={searchHandler} 
      />
      <Box sx={{ mt: 2 }}>
        <RetailerSubCategoryList searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
