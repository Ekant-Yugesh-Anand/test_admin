import MainOrders from "./main-orders";
const orderId = "4";

export default function OutForDelivery() {
  return (
    <MainOrders
      title="Out-For-Delivery-Orders"
      orderStatus={orderId}
      filename="out-for-delivery-orders-csv"
    />
  );
}
