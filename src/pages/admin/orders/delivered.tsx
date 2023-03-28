import MainOrders from "./main-orders";
const orderId = "5";

export default function Delivered() {
  return (
    <MainOrders
      title="Delivered-Orders"
      orderStatus={orderId}
      filename="delivered-orders-csv"
    />
  );
}
