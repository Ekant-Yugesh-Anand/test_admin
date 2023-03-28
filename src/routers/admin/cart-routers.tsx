import ShoppinCart from "../../pages/admin/cart/ShoppingCart";

export default {
  path: "/shopping-cart",
  children: [
    {
      path: "new",
      element: <ShoppinCart deleted="0"/>,
    },
    {
      path: "placed",
      element: <ShoppinCart deleted="2"/>,
    },
    {
      path: "removed",
      element: <ShoppinCart deleted="1"/>,
    },
  ],
};
