import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Select,
  styled,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import * as OrderForms from "./order-forms";
import * as ReturnOrderForms from "./return-order-forms";

const Option = styled(MenuItem)({
  fontSize: "small",
});

export default function MoveOrdersDialog(props: {
  orderStatus: string;
  orders: Record<string, any>;
  open: boolean;
  onClose: () => void;
  refetch: Function;
}) {
  const { open, onClose, orderStatus, orders, refetch } = props;
  const [select, setSelect] = React.useState("");
  const orderStatusList = React.useMemo(() => {
    const defaultList = [
      { title: "New", value: "0" },
      // { title: "Accepted", value: "1" },
      // { title: "In Process", value: "3" },
      // { title: "Out for Delivery", value: "4" },
      // { title: "Delivered", value: "5" },
      // { title: "Cancelled from Farmer", value: "7" },
      // { title: "Cancelled from Retailer", value: "9" },
      // { title: "Cancelled from Delivery partner", value: "10" },
      // { title: "Cancelled from Delivery agent", value: "11" },
      // { title: "Re-schedule Order", value: "2" },
    ];

    if (orderStatus === "0") {
      return [
        { title: "Accepted", value: "1" },
        { title: "Cancelled from Farmer", value: "7" },
      ];
    }
    if (orderStatus === "1") {
      return [
        { title: "In Process", value: "3" },
        { title: "Cancelled from Farmer", value: "7" },
        { title: "Cancelled from Retailer", value: "9" },
      ];
    }
    if (orderStatus === "3") {
      return [
      
        { title: "Out for Delivery", value: "4" },
        { title: "Cancelled from Farmer", value: "7" },
        { title: "Cancelled from Retailer", value: "9" },
        { title: "Cancelled from Delivery partner", value: "10" },
        { title: "Cancelled from Delivery agent", value: "11" },
      ];
    }
    if (orderStatus === "4") {
      return [
        { title: "Delivered", value: "5" },
        { title: "Cancelled from Farmer", value: "7" },
        { title: "Cancelled from Delivery partner", value: "10" },
        { title: "Cancelled from Delivery agent", value: "11" },
        { title: "Re-schedule Order", value: "2" },
      ];
    }
    if (orderStatus === "5") {
      return [
      ];
    }
    // if (orderStatus !== "0" || "1" || "3" || "4" || "5") {
    //   return [
    //     { title: "Accepted", value: "1" },
    //     { title: "In Process", value: "3" },
    //     { title: "Out for Delivery", value: "4" },
    //     { title: "Delivered", value: "5" },
    //     { title: "Cancelled from Farmer", value: "7" },
    //     { title: "Cancelled from Retailer", value: "9" },
    //     { title: "Cancelled from Delivery partner", value: "10" },
    //     { title: "Cancelled from Delivery agent", value: "11" },
    //     { title: "Re-schedule Order", value: "2" },
    //   ];
    // }
    return defaultList;
  }, []);

  const orderStatusOnForms = React.useMemo<Record<string, any>>(() => {
    const defaultObj = {
      "0": (
        <OrderForms.NewOrder
          key={0}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "1": (
        <OrderForms.Accepted
          key={1}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "3": (
        <OrderForms.InProcess
          key={3}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "2": (
        <OrderForms.ReScheduleOrder
          key={2}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "4": (
        <OrderForms.OutForDelivery
          key={4}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "5": (
        <OrderForms.Delivered
          key={5}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "7": (
        <OrderForms.CancelledFromFarmer
          key={7}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "9": (
        <OrderForms.CancelledFromRetailer
          key={9}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "10": (
        <OrderForms.CancelledFromPartner
          key={9}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "11": (
        <OrderForms.CancelledFromAgent
          key={10}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
    };
    if (orderStatus === "5")
      return {
        ...defaultObj,
        "return-farmer": (
          <ReturnOrderForms.MoveOnReason
            key={10}
            onClose={onClose}
            orders={orders}
            refetch={refetch}
            variant="farmer"
          />
        ),
      };
    return defaultObj;
  }, [orders]);

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>Move Orders</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: 400,
            margin: "auto",
          }}
        >
          <FormControl fullWidth sx={{ mt: 1 }} size="small">
            <InputLabel id="demo-select-small" color="secondary">
              Move Orders
            </InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              fullWidth
              label="Move Orders"
              color="secondary"
              value={select}
              onChange={(e) => setSelect(e.target.value)}
            >
              <Option value="">
                <em>None</em>
              </Option>
              {orderStatusList.map((item, index) =>
                orderStatus !== item.value ? (
                  <Option value={item.value.toString()} key={index}>
                    {item.title}
                  </Option>
                ) : null
              )}
            </Select>
          </FormControl>
          {orderStatusOnForms[select]}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
