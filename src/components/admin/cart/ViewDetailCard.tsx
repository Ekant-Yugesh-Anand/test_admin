import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import usePrintData from "../../../hooks/usePrintData";
import ShopAvatar from "../../Image/shop-avatar";
import { LabelText } from "../retailers/styled";

const label = [
  { title: "Farmer name", accessor: "customer_name" },
  { title: "Phone Number", accessor: "phone_no" },
  {
    title: "Added",
    accessor: "doc",
    Cell: (cell: any) => (
      <>
        {cell.value ? (
          <Typography fontSize={"small"} textAlign={"center"}>
            {dayjs(cell.value).format("D-MMM-YYYY")}{" "}
            {dayjs(cell.value).format("hh:mm a")}
          </Typography>
        ) : null}
      </>
    ),
  },
];
const label1 = [
  { title: "SKU Name", accessor: "sku_name" },
  { title: "SKU Code", accessor: "sku_code" },
  { title: "Volume", accessor: "dimension" ,
  Cell: (cell: any) => (
    <Typography fontSize={"small"}>
      {cell.value && cell.value > 0 ? (
        <>
          {cell.value}cm<sup>3</sup>
        </>
      ) : null}
    </Typography>
  ),
},
  { title: "Qty", accessor: "quantity" },
  { title: "Weight", accessor: "weight" },
  { title: "Unit Price", accessor: "total_price" },
  {
    title: "Added",
    accessor: "doc",
    Cell: (cell: any) => (
      <>
        {cell.value ? (
          <Typography fontSize={"small"} >
            {dayjs(cell.value).format("D-MMM-YYYY")}{" "}
            {dayjs(cell.value).format("hh:mm a")}
          </Typography>
        ) : null}
      </>
    ),
  },
];

function ViewDetailCard(props: {
  orderDetail: { [key: string]: any };
  type: string;
}) {
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
        flexDirection:"column"
      }}
      elevation={5}
    >
      {type == "customers" ? (
        <ShopAvatar
          src={orderDetail?.sku_image}
          sx={{ height: 80, width: 80 }}
          variant="rounded"
          download
          {...props}
        />
        
      ) : null}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Grid container>
            {obj.map((item, index) => (
              <Grid key={index} item md={12} lg={12} width="100%">
                <Box sx={{ display: "flex", gap: 2 }}>
                  <LabelText fontSize={"small"}>{item.get("title")}:</LabelText>
                  <Typography fontSize={"small"}>{item.get("Cell")}</Typography>
                  <br />
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
