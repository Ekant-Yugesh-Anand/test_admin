import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { LabelText } from "../styled";
import usePrintData from "../../../../hooks/usePrintData";
import ShopAvatar from "../../../Image/shop-avatar";
import React from "react";
import AssignDialogBox from "./sku-assign-dialog";

export default function SkuCard(props: {
  sku: { [key: string]: any };
  variant: "assign" | "unassign";
  onClick: (sku: { [key: string]: any }) => Promise<void>;
}) {
  const { sku, variant, onClick } = props;

  const [asignData, setAssignData] = React.useState<{
    value: Record<string, any>;
    open: boolean;
  }>({
    value: {},
    open: false,
  });

  const label1 = [
    { title: "weight", accessor: "weight" },
    { title: "MRP₹", accessor: "mrp" },
    { title: "Total Qty.", accessor: "quantity" },
    { title: "Qty. in stock", accessor: "quantity" },
  ];

  const label2 = [
    { title: "SKU ID", accessor: "sku_id" },
    { title: "category", accessor: "category_name" },
    { title: "subcategory", accessor: "subcategory_name" },
    { title: "brand", accessor: "brand_name" },
  ];
  const label3 = [
    { title: "Cargill Margin(%)", accessor: "margin" },
    { title: "Cargill Margin Amount(₹)", accessor: "margin_amount" },
  ];

  const assignModalClose = () => setAssignData({ open: false, value: {} });

  const { printData: obj1 } = usePrintData({
    labels: label1,
    data: sku,
  });
  const { printData: obj2 } = usePrintData({
    labels: label2,
    data: sku,
  });

  const { printData: obj3 } = usePrintData({
    labels: [
      {
        title: variant == "assign" ? "Price" : "Sale Price",
        accessor: variant == "assign" ? "price" : "sale_price",
      },
      ...label3,
    ],
    data: sku,
  });

  return (
    <Card sx={{ width: 350 }} elevation={5}>
      <ShopAvatar
        src={sku.image}
        sx={{ height: 180, width: "100%" }}
        defaultImg={{
          variant: "rounded",
          sx: {
            backgroundColor: "#fff",
            height: 150,
            width: 150,
          },
        }}
        variant="square"
        download
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {sku?.sku_name || "No Name"}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container>
              {obj2.map((item, index) => (
                <Grid key={index} item xs={12}>
                  
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LabelText>{item.get("title")}:</LabelText>
                      <Typography>
                        {item.get("Cell").props.children
                          ? item.get("Cell")
                          : "0"}
                      </Typography>
                    </Box>
                  
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                {obj1.map((item, index) => (
                  <Grid key={index} item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <LabelText>{item.get("title")}:</LabelText>
                      <Typography>
                        {item.get("Cell").props.children
                          ? item.get("Cell")
                          : "0"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid container>
              {obj3.map((item, index) => (
                <Grid key={index} item xs={12}>
                  {item.get("title") == "Cargill Margin Amount(₹)" ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LabelText>{item.get("title")}:</LabelText>
                      <Typography>
                        {item.get("Cell").props.children
                          ? item.get("Cell")
                          : variant == "assign"
                          ? (sku?.price * sku?.margin?.split("%")[0]) / 100
                          : "0"}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LabelText>{item.get("title")}:</LabelText>
                      <Typography>
                        {item.get("Cell").props.children
                          ? item.get("Cell")
                          : "0"}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color={variant === "assign" ? "secondary" : "error"}
          variant="outlined"
          onClick={async () => {
            variant == "assign"
              ? setAssignData({
                  value: sku,
                  open: true,
                })
              : await onClick(sku);
          }}
        >
          {variant === "assign" ? "assign" : "un-assign"}
        </Button>
      </CardActions>
      <AssignDialogBox
        open={asignData?.open}
        sku={sku}
        onClickClose={assignModalClose}
        onClickOk={async () => {
          assignModalClose();
          await onClick(sku);
        }}
      />
    </Card>
  );
}
