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
  IconButton,
} from "@mui/material";
import * as OrderForms from "./order-forms";
import * as ReturnOrderForms from "./return-order-forms";
import { AiOutlineClose } from "react-icons/ai";

const Option = styled(MenuItem)({
  fontSize: "small",
});

export default function ReturnMoveOrdersDialog(props: {
  orderStatus: string;
  orders: Record<string, any>;
  open: boolean;
  onClose: () => void;
  refetch: Function;
}) {
  const { open, onClose, orderStatus, orders, refetch } = props;
  const [select, setSelect] = React.useState("");
  const orderStatusList = React.useMemo(
    () => [
      

      { title: "Accept order", value: "2" },
      // { title: "Restore order from Retailer", value: "5" },
      { title: "In process order", value: "6" },
      // { title: "Restore order from Partner", value: "8" },
      { title: "Out for pickup", value: "9" },
      { title: "Reschedule Order", value: "10" },
      { title: "Picked up from farmer", value: "11" },
      { title: "Returned order", value: "12" },
      { title: "Cancel from Retailer", value: "4" },
      { title: "Cancel from Partner", value: "7" },


      // { title: "Choose Manger", value: "3" },
      // { title: "Refund Order", value: "17" },
    ],
    []
  );

  const orderStatusOnForms = React.useMemo<Record<string, any>>(
    () => ({
      "2": (
        <ReturnOrderForms.Accept
          key={1}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "3": (
        <ReturnOrderForms.ChooseManger
          key={2}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "4": (
        <ReturnOrderForms.CancelFromRetailer
          key={3}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "5": (
        <ReturnOrderForms.RestoreFromRetailer
          key={4}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "6": (
        <ReturnOrderForms.InProcess
          key={5}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "7": (
        <ReturnOrderForms.CancelFromPartner
          key={6}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "8": (
        <ReturnOrderForms.RestoreFromPartner
          key={7}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "9": (
        <ReturnOrderForms.OutForPickup
          key={8}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "10": (
        <ReturnOrderForms.Reschedule
          key={9}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "11": (
        <ReturnOrderForms.PickedUpFromFarmer
          key={10}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "12": (
        <ReturnOrderForms.Returned
          key={11}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),

      "17": (
        <ReturnOrderForms.Refunded
          key={11}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
    }),
    [orders]
  );

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>Move Orders ( Return )</DialogTitle>
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
                // orderStatus !== item.value ? (
                  <Option value={item.value.toString()} key={index}>
                    {item.title}
                  </Option>
                // ) : null
              )}
            </Select>
          </FormControl>
          {orderStatusOnForms[select]}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
