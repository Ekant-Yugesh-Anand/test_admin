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

const label = [
  { title: "Farmer name", accessor: "customer_name" },
  { title: "Phone Number", accessor: "phone_no" },
  { title: "Total Product", accessor: "no_of_products" },
];

const label1 = [
  { title: "SKU Name", accessor: "sku_name" },
  { title: "Dimension", accessor: "dimension" },
  { title: "Qty", accessor: "quantity" },
  { title: "Weight", accessor: "weight" },
  { title: "Unit Price Sub Total", accessor: "total_price" },
  { title: "Number of Farmers", accessor: "no_of_customer" },
];

function CartCard(props: { data?: { [key: string]: any }; type: string; deleted:string }) {
  const { data, type , deleted} = props;

  const [orderDetailShow, setOderDetailShow] = React.useState(false);

  const { printData: obj } = usePrintData({
    labels: type == "customers" ? label : label1,
    data: data,
  });

  useEffect(()=>{
    setOderDetailShow(false)
  },[type,deleted])

  return (
    <Card elevation={4}>
      <CardContent>
        <Card sx={{ minHeight: "150px" , display:"flex",flexDirection:"row", gap:3}}>
          {data?.sku_image ? (
            <ShopAvatar
              src={data?.sku_image}
              sx={{ height: 150, width: 150 }}
              variant="rounded"
              download
              {...props}
            />
          ) : null}
          <Grid container >

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
