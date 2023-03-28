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

const label1 = [
  { title: "weight", accessor: "weight" },
  { title: "MRP₹", accessor: "mrp" },
];

const label2 = [
  { title: "SKU ID", accessor: "sku_id" },
  { title: "category", accessor: "category_name" },
  { title: "subcategory", accessor: "subcategory_name" },
  { title: "brand", accessor: "brand_name" },
  { title: "Margin(%)", accessor: "margin" },
  { title: "Margin Amount(₹)", accessor: "margin_amount" },
];

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

  const assignModalClose = () => setAssignData({ open: false, value: {} });

  const { printData: obj1 } = usePrintData({
    labels: label1,
    data: sku,
  });
  const { printData: obj2 } = usePrintData({
    labels: label2,
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
                  {item.get("Cell").props.children ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LabelText>{item.get("title")}:</LabelText>
                      <Typography>{item.get("Cell")}</Typography>
                    </Box>
                  ) : null}
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
                      <Typography>{item.get("Cell")}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
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
