import * as Yup from "yup";
import { emptyText } from "../../../../constants/messages";

export const deliveryChargeSchema = Yup.object({
  delivery_charge: Yup.string().required(emptyText("Delivery Amount")),
});



