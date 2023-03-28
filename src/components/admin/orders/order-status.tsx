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
    name: "in-process",
    color: "#a414dd",
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
    name: "return from farmer",
    color: "#0ee932",
  },
  "7": {
    name: "cancel from farmer",
    color: "#e90e24",
  },
  "8": {
    name: "return in process",
    color: "#0ee932",
  },
  "9": {
    name: "cancel from retailer",
    color: "#d77b11",
  },
  "10": {
    name: "cancel from manager/agent",
    color: "#0ee932",
  },
  "11": {
    name: "cancel return",
    color: "#e90e69",
  },
  "12": {
    name: "return in process",
    color: "#0ee932",
  },
  "13": {
    name: "cancel return",
    color: "#e90e69",
  },
  "14": {
    name: "return in process",
    color: "#0ee932",
  },
  "15": {
    name: "cancel return",
    color: "#e90e69",
  },
  "16": {
    name: "return in process",
    color: "#0ee932",
  },
  "17": {
    name: "returned",
    color: "#120ee9",
  },
  "18": {
    name: "refunded",
    color: "#a414dd",
  },
  "20":{
    name:"failed",
    color:"#FF0000"
  }
};

export default function OrderStatus(props: {
  value: number,
  retailer?: boolean

}) {
  const { value , retailer} = props;

  return (
    <Box textAlign={"center"}>
      <Typography
        fontSize={retailer ? "medium":  "small"}
        fontWeight="bold"
        fontStyle={retailer ? "normal":"oblique"}
        textTransform={retailer ? "capitalize":"inherit"}
        sx={{
          color: label[value.toString()]?.color,
        }}
      >
        {label[value.toString()]?.name}
      </Typography>
    </Box>
  );
}
