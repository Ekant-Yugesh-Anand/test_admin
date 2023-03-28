import MainOrders from "./main-orders";
const orderId = "0";

export default function NewOrders() {
  return (
    <MainOrders
      title="New-Orders"
      orderStatus={orderId}
      filename="new-orders-csv"
    />
  );
}
