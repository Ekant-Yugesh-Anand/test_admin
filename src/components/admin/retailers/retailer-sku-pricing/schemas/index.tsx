import * as Yup from "yup";
import { emptyText } from "../../../../../constants/messages";

export const skuPricingSchema = Yup.object({
  mrp: Yup.number(),
  sale_price: Yup.number().required(emptyText("sale price")).max(Yup.ref("mrp")),
  quantity: Yup.number().required(emptyText("quantity")),
  used_quantity: Yup.number().required(emptyText("used quantitydsa")).max(Yup.ref("quantity")),
});
