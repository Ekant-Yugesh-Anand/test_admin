import MainOrders from "./main-orders";
const orderId = "1";

export default function Accepted() {
  return (
    <MainOrders
      title="Accepted-Orders"
      orderStatus={orderId}
      filename="accepted-orders-csv"
    />
  );
}
