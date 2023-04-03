import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  Typography,
} from "@mui/material";
import { LabelText } from "../retailers/styled";
import usePrintData from "../../../hooks/usePrintData";
import ProductDetailsList from "./ProductDetailsList";
import ShopAvatar from "../../Image/shop-avatar";
import dayjs from "dayjs";

const label = [
  { title: "Farmer name", accessor: "customer_name" },
  { title: "Phone Number", accessor: "phone_no" },
  { title: "Total Product", accessor: "no_of_products" },
  {
    title: "Date",
    accessor: "doc",
    Cell: (cell: any) => (
      <>
        <Typography textAlign={"center"}>
          {dayjs(cell.value).format("D-MMM-YYYY")}{" "}
          {dayjs(cell.value).format("hh:mm a")}
        </Typography>
      </>
    ),
  },
];

const label1 = [
  { title: "SKU Name", accessor: "sku_name" },
  { title: "Volume", accessor: "dimension" },
  { title: "Qty", accessor: "quantity" },
  { title: "Weight", accessor: "weight" },
  { title: "Unit Price Sub Total", accessor: "total_price" },
  { title: "Number of Farmers", accessor: "no_of_customer" },
  {
    title: "Date",
    accessor: "doc",
    Cell: (cell: any) => (
      <>
        <Typography textAlign={"center"}>
          {dayjs(cell.value).format("D-MMM-YYYY")}{" "}
          {dayjs(cell.value).format("hh:mm a")}
        </Typography>
      </>
    ),
  },
];

function CartCard(props: {
  data?: { [key: string]: any };
  type: string;
  deleted: string;
}) {
  const { data, type, deleted } = props;

  const [orderDetailShow, setOderDetailShow] = React.useState(false);

  const { printData: obj } = usePrintData({
    labels: type == "customers" ? label : label1,
    data: data,
  });

  useEffect(() => {
    setOderDetailShow(false);
  }, [type, deleted]);

  return (
    <Card elevation={4}>
      <CardContent>
        <Card
          sx={{
            minHeight: "150px",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          {data?.sku_image ? (
            <ShopAvatar
              src={data?.sku_image}
              sx={{ height: 150, width: 150 }}
              variant="rounded"
              download
              {...props}
            />
          ) : null}
          <Grid container>
            {obj.map((item, index) => (
              <Grid key={index} item lg={12}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LabelText>{item.get("title")}:</LabelText>
                  <Typography>{item.get("Cell")}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>

        <Box display="flex" justifyContent="flex-end" marginY={2} gap={1}>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => setOderDetailShow(!orderDetailShow)}
          >
            View
          </Button>
        </Box>

        <Collapse in={orderDetailShow}>
          <ProductDetailsList
            key={type == "customers" ? data?.customer_id : data?.sku_id}
            id={type == "customers" ? data?.customer_id : data?.sku_id}
            type={type}
            deleted={deleted}
          />
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default CartCard;
