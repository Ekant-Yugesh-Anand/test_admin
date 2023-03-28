import React from "react";
import { Box } from "@mui/material";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import { useNavigate, useParams } from "react-router-dom";
import { retailer } from "../../../../http";
import { useQuery } from "@tanstack/react-query";
import RetailerCategoryList from "../../../../components/admin/retailers/category-list-results";

export default function RetailersCategory() {
  const { retailer_id } = useParams();
  const [searchText, setSearchText] = React.useState("");
  const navigate = useNavigate();
  const { data } = useQuery(["retailer-name", retailer_id], () =>
  retailer("get", { params: retailer_id })
);

const retailerName = React.useMemo(() => {
  if (data?.status) return data.data?.retailer_name;
  return "";
}, [data]);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_retailer=${value}` : "");
  };

  return (
    <MainContainer>
      <CommonToolbar
        title={`${retailerName || ""}/Category`}
        // onSearch={searchHandler}
        onAddProps={{
          title: "Add Category",
          onClick() {
            navigate("add_category");
          },
        }}
      />
      <Box sx={{ mt: 2 }}>
        <RetailerCategoryList searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
