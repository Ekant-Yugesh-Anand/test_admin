import * as Yup from "yup";
import { emptyText } from "../../../../constants/messages";

export const deliveryChargeSchema = Yup.object({
  delivery_from: Yup.string().required(emptyText("delivery from")),
  delivery_to: Yup.string().required(emptyText("delivery to")),
  delivery_charge: Yup.string().required(emptyText("delivery charge")),
});
