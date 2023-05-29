import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
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
import { AiOutlineClose } from "react-icons/ai";

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
    const defaultList = [{ title: "New", value: "0" }];

    if (orderStatus === "0") {
      return [
        { title: "Accepted", value: "1" },
        { title: "Cancelled from Farmer", value: "7" },
      ];
    }
    if (orderStatus === "1") {
      return [
        { title: "Choose Partner", value: "2" },
        { title: "Cancelled from Farmer", value: "7" },
        { title: "Cancelled from Retailer", value: "9" },
      ];
    }
    if (orderStatus === "2") {
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
        { title: "Re-schedule Order", value: "13" },
      ];
    }
    if (orderStatus === "5") {
      return [];
    }

    if (orderStatus == "7,9,10" || 7 || 9 || 10) {
      return [{ title: "Restore Order", value: 12 }];
    }

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
      "2": (
        <OrderForms.ChooseManager
          key={2}
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
      "13": (
        <OrderForms.ReScheduleOrder
          key={13}
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
      "12": (
        <OrderForms.RestoreOrder
          key={12}
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
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          fontSize: "25px",
          fontWeight: "800",
          cursor: "pointer",
        }}
      >
        <AiOutlineClose />
      </IconButton>
      <DialogContent>
        <Box
          sx={{
            width: 400,
            margin: "auto",
          }}
        >
          <FormControl fullWidth size="small">
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
