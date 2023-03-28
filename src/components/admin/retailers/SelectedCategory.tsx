import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import CategoryCard from "./CategoryCard";
export default function SelectedCategoryData(props: {
  CategoryData: Array<{ [key: string]: any }>;
  changeCategoryData: (data: object, del: boolean) => void;
}) {
  const { CategoryData } = props;
  const [categoryData, setCategoryData] = React.useState<
    Array<{ [key: string]: any }>
  >([]);

  React.useEffect(() => {
    setCategoryData([])
    CategoryData.map((cat) => {
      cat.subcategories.map((subcat: any) => {
        setCategoryData((prev) => [
          ...prev,
          {
            category_id: cat.category_id,
            subcategory_id: subcat.subcategory_id,
            margin: subcat.margin,
          },
        ]);
      });
    });
  }, [CategoryData]);


  return (
    <Box>
      <Box sx={{ my: 2 }}>
        <Box>
          <Typography variant={"h6"}>Selected Category List</Typography>
        </Box>
        <Box sx={{ my: 1, maxHeight: 300, overflow: "scroll" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {categoryData.map((cat_data) => (
              <CategoryCard {...cat_data} key={cat_data.subcategory_id}/>
            ))}
          </div>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}
