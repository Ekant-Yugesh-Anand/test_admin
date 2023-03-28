import MainOrders from "./main-orders";
const orderId = "20";

export default function FailedOrders() {
  return (
    <MainOrders
      title="Failed-Orders"
      orderStatus={orderId}
      filename="new-orders-csv"
    />
  );
}
