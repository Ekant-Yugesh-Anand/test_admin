import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { LabelText } from "../styled";
import usePrintData from "../../../../hooks/usePrintData";
import { FaCheck, FaRupeeSign, FaStar } from "react-icons/fa";
import ErrorSuccessChip from "../../../common/error-success-chip";
import { MdError } from "react-icons/md";
// import { shopProducts } from "../../../../http";
import { useSnackbar } from "notistack";
import ShopAvatar from "../../../Image/shop-avatar";

const label1 = [
  { title: "weight", accessor: "weight" },
  { title: "MRP", accessor: "mrp" },
  { title: "price", accessor: "price" },
  { title: "Sale Price", accessor: "sale_price" },
];

const label2 = [
  { title: "SKU ID", accessor: "sku_id" },
  { title: "category", accessor: "category_name" },
  { title: "subcategory", accessor: "subcategory_name" },
  { title: "brand", accessor: "brand_name" },
  { title: "sku code", accessor: "sku_code" },
  {title:"Margin(%)", accessor:"margin"},
  {title:"Margin Amount(₹)", accessor:"margin_amount"}
];

export default function SkuPricingCard(props: {
  sku: { [key: string]: any };
  refetch: Function;
  onClickPrice: () => void;
}) {
  const { sku, refetch, onClickPrice } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [focusLoading, setFocusLoading] = React.useState(false);
  const { printData: obj1 } = usePrintData({
    labels: label1,
    data: sku,
  });
  const { printData: obj2 } = usePrintData({
    labels: label2,
    data: sku,
  });

  // const focusOnOff = async () => {
  //   try {
  //     setFocusLoading(true);
  //     const res = await shopProducts("put", {
  //       params: sku?.sku_id,
  //       data: JSON.stringify({
  //         focus_sku: !sku.focus_sku ? 1 : 0,
  //       }),
  //     });
  //     if (res?.status === 200) {
  //       refetch();
  //       enqueueSnackbar((!sku.focus_sku ? "On" : "Off") + " successfully 😊", {
  //         variant: "success",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     enqueueSnackbar((sku.focus_sku ? "On" : "Off") + " failed 😢", {
  //       variant: "error",
  //     });
  //   }
  //   setFocusLoading(false);
  // };

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
                 {item.get("Cell").props.children ? <Box sx={{ display: "flex", gap: 1 }}>
                    <LabelText>{item.get("title")}:</LabelText>
                    <Typography>{item.get("Cell")}</Typography>
                  </Box>:null}
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
        <Box display={"flex"} gap={2} flexWrap="wrap">
          <ErrorSuccessChip
            show={sku.active === 0}
            values={{
              error: "Deactive",
              success: "Active",
            }}
            icons={{
              error: <MdError />,
              success: <FaCheck size={15} />,
            }}
          />
          <Chip
            size="small"
            color={!sku.focus_sku ? "error" : "warning"}
            label={!sku.focus_sku ? "Off" : "On"}
            variant="outlined"
            icon={
              focusLoading ? (
                <CircularProgress
                  size={15}
                  color={!sku.focus_sku ? "error" : "warning"}
                />
              ) : !sku.focus_sku ? (
                <MdError />
              ) : (
                <FaStar size={15} />
              )
            }
            // onClick={focusOnOff}
          />
          <Chip
            icon={<FaRupeeSign size={15} />}
            label="price"
            size="small"
            variant="outlined"
            color="secondary"
            onClick={onClickPrice}
          />
        </Box>
      </CardActions>
    </Card>
  );
}
