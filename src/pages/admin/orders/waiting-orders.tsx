import MainOrders from "./main-orders";
const orderId = "2";

export default function WaitingOrder() {
  return (
    <MainOrders
      title="Waiting Order"
      orderStatus={orderId}
      filename="accepted-orders-csv"
    />
  );
}
