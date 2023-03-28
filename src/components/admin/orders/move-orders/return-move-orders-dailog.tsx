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
      { title: "New", value: "6" },
      { title: "Accept", value: "8" },
      { title: "In Process", value: "12" },
      { title: "Pickup", value: "14" },
      { title: "Out of pickup", value: "16" },
      { title: "Returning", value: "17" },
      { title: "Returned", value: "18" },
      { title: "Cancel return order by retailer", value: "11" },
      { title: "Cancel return order by delivery partner", value: "13" },
      { title: "Cancel return order by delivery agent", value: "15" },
    ],
    []
  );

  const orderStatusOnForms = React.useMemo<Record<string, any>>(
    () => ({
      "6": (
        <ReturnOrderForms.MoveOnReason
          key={0}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
          variant="farmer"
        />
      ),
      "8": (
        <ReturnOrderForms.Accept
          key={1}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "12": (
        <ReturnOrderForms.InProcess
          key={3}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "14": (
        <ReturnOrderForms.MoveOnOrderStatus
          key={11}
          title="Move Pickup"
          orderStatus={14}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "16": (
        <ReturnOrderForms.MoveOnOrderStatus
          key={11}
          title="Move Out For Pickup"
          orderStatus={16}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "17": (
        <ReturnOrderForms.MoveOnOrderStatus
          key={11}
          title="Move Returning"
          orderStatus={17}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "18": (
        <ReturnOrderForms.Returned
          key={9}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "11": (
        <ReturnOrderForms.MoveOnReason
          key={10}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
          variant="retailer"
        />
      ),
      "13": (
        <ReturnOrderForms.MoveOnReason
          key={11}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
          variant="delivery-partner"
        />
      ),
      "15": (
        <ReturnOrderForms.MoveOnReason
          key={12}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
          variant="delivery-agent"
        />
      ),
    }),
    [orders]
  );

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
