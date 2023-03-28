import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { LabelText } from "../retailers/styled";
import usePrintData from "../../../hooks/usePrintData";

const label = [
  { title: "Category Id", accessor: "category_id" },
  { title: "Sub category Id", accessor: "subcategory_id" },
  { title: "Margin in (%)", accessor: "margin" },
];

function CategoryCard(props: any) {
  const { printData: obj } = usePrintData({
    labels: label,
    data: props,
  });

  return (
    <Card >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Grid container>
            {obj.map((item, index) => {
              if (item.get("Cell")?.props?.children)
                return (
                  <Grid key={index} item lg={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LabelText>{item.get("title")}:</LabelText>
                      <Typography>{item.get("Cell")}</Typography>
                    </Box>
                  </Grid>
                );
            })}
          </Grid>
        </Box>

      </CardContent>
    </Card>
  );
}

export default CategoryCard;
