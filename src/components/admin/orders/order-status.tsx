import { Box, Typography } from "@mui/material";

const label: { [key: string]: any } = {
  "0": {
    name: "new",
    color: "#120ee9",
  },
  "1": {
    name: "accepted",
    color: "#e90e69",
  },
  "2": {
    name: "Waiting for delivery agent (Choose Agent)",
    color: "#fde047",
  },
  "3": {
    name: "in-process",
    color: "#a414dd",
  },
  "4": {
    name: "out-for-delivery",
    color: "#d77b11",
  },
  "5": {
    name: "delivered",
    color: "#1896ea",
  },
  "6": {
    name: "resheduled",
    color: "#0ee932",
  },
  "7": {
    name: "cancel from farmer",
    color: "#e90e24",
  },
  "8": {
    name: "restored from farmer",
    color: "#0ee932",
  },
  "9": {
    name: "cancel from retailer",
    color: "#d77b11",
  },
  "10": {
    name: "cancel from manager",
    color: "#0ee932",
  },
  "11": {
    name: "restored from retailer",
    color: "#e90e69",
  },
  "12": {
    name: "restored from manager",
    color: "#0ee932",
  },
  "20": {
    name: "payment failed",
    color: "#FF0000",
  },
};

const returnLabel: { [key: string]: any } = {
  "1": {
    name: "return initiated",
    color: "#120ee9",
  },
  "2": {
    name: "return accepted (retailer)",
    color: "#e90e69",
  },
  "3": {
    name: "Return cancelled from retailer",
    color: "#a414dd",
  },
  "4": {
    name: "Waiting for delivery manager",
    color: "#a414dd",
  },
  "5": {
    name: "Return in process",
    color: "#d77b11",
  },
  "6": {
    name: "Return cancelled from delivery manager",
    color: "#1896ea",
  },
  "7": {
    name: "Out for pick up order",
    color: "#0ee932",
  },
  "8": {
    name: "return resheduled",
    color: "#e90e24",
  },
  "9": {
    name: "return picked up from farmer",
    color: "#0ee932",
  },
  "11": {
    name: "returned",
    color: "#d77b11",
  },
  "12": {
    name: "refunded",
    color: "#0ee932",
  },
  "13": {
    name: "returned restored from retailer",
    color: "#e90e69",
  },
  "14": {
    name: "returned restored from manager",
    color: "#0ee932",
  },
};

export default function OrderStatus(props: {
  value: number;
  retailer?: boolean;
  returnValue?: number;
}) {
  const { value, retailer, returnValue } = props;

  // console.log(returnValue)

  return (
    <Box textAlign={"center"}>
      <Typography
        fontSize={retailer ? "medium" : "small"}
        fontWeight="bold"
        fontStyle={retailer ? "normal" : "oblique"}
        textTransform={retailer ? "capitalize" : "inherit"}
        sx={{
          color: returnValue
            ? returnLabel[returnValue.toString()]?.color
            : label[value.toString()]?.color,
          textTransform: "capitalize",
        }}
      >
        {returnValue
          ? returnLabel[returnValue.toString()]?.name
          : label[value.toString()]?.name}
      </Typography>
    </Box>
  );
}
