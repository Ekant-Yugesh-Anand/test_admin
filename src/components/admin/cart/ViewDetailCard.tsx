import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import usePrintData from "../../../hooks/usePrintData";
import ShopAvatar from "../../Image/shop-avatar";
import { LabelText } from "../retailers/styled";

const label = [
  { title: "Farmer name", accessor: "customer_name" },
  { title: "Phone Number", accessor: "phone_no" },
  { title: "Total Product", accessor: "no_of_products" },
];
const label1 = [
  { title: "SKU Name", accessor: "sku_name" },
  { title: "Volume", accessor: "dimension" },
  { title: "Qty", accessor: "quantity" },
  { title: "Weight", accessor: "weight" },
  { title: "Unit Price Sub Total", accessor: "total_price" },
];

function ViewDetailCard(props: { orderDetail: { [key: string]: any }; type: string }) {
  const { orderDetail, type } = props;

  const { printData: obj } = usePrintData({
    labels: type == "customers" ? label1 : label,
    data: orderDetail,
  });

  return (
    <Card
      sx={{
        display: "flex",
        maxWidth: 600,
        p: 1,
        alignItems: "center",
      }}
      elevation={5}
    >
      {type == "customers" ? (
        <ShopAvatar
          src={orderDetail?.sku_image}
          sx={{ height: 150, width: 150 }}
          variant="rounded"
          download
          {...props}
        />
      ) : null}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Grid container>
            {obj.map((item, index) => (
              <Grid key={index} item md={12} lg={12}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <LabelText fontSize={"small"}>{item.get("title")}:</LabelText>
                  <Typography fontSize={"small"}>{item.get("Cell")}</Typography>
                  <br/>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Box>
    </Card>
  );
}

export default ViewDetailCard;
