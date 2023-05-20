import * as Yup from "yup";
import { emptyText } from "../../../../../constants/messages";

export const areaSchema = Yup.object({
  area: Yup.string().required(emptyText("Area")),
  city: Yup.string().required(emptyText("City")),
  state: Yup.string().required(emptyText("State")),
  country: Yup.string().required(emptyText("Country")),
  pincode: Yup.string().length(6,"Invalid pincode").required(emptyText("Pincode")),
});

export const unitSchema = Yup.object({
  units: Yup.string().required(emptyText("Unit name")),
});

export const packageSchema = Yup.object({
  package: Yup.string().required(emptyText("Package name")),
});
export const materialSchema = Yup.object({
  material: Yup.string().required(emptyText("Material name")),
});

export const reasonSchema = Yup.object({
  reason_name: Yup.string().required(emptyText("Reason name")),
  reason_type: Yup.string().required(emptyText("Reason type")),
});

export const couponSchema = Yup.object({
  batch_name: Yup.string().required(emptyText("Coupon Name")),
  coupon_code: Yup.string().when(["coupon_type", "variant"], {
    is: (type: string, variant: string) => {
      if (type == "dynamic" && variant == "save") return true;
      else return false;
    },
    then: Yup.string()
      .required(emptyText("Coupon code"))
      .min(5, "Must be 5 char long"),
  }),
  price: Yup.number().positive().required(emptyText("Price")).max(Yup.ref("order_value")),
  valid_from: Yup.date().required(emptyText("Valid from")),
  valid_till: Yup.date()
    .required(emptyText("Valid till"))
    .min(Yup.ref("valid_from")),
  coupon_quantity: Yup.number().when("coupon_type", {
    is: "static",
    then: Yup.number().required(emptyText("No of Coupon")),
  }),
  user_qty: Yup.number().when("coupon_type", {
    is: "dynamic",
    then: Yup.number().required(emptyText("Usages allowed")),
  }),
  order_value: Yup.number().required(emptyText("Order value")),
  description: Yup.string().required(emptyText("Description")),
});

export const languageSchema = Yup.object({
  language: Yup.string().required(emptyText("Language")),
  lang_code: Yup.string().required(emptyText("Languge code")),
  language_native: Yup.string().required(emptyText("Language native")),
});

export const notificationSchema = Yup.object({
  notification: Yup.string().required(emptyText("Notification")),
  message: Yup.string().required(emptyText("Message")),
  user: Yup.string().required(emptyText("User")),
});

export const coupon_languge_schema = Yup.object({
  batch_name: Yup.string().required(emptyText("Batch Name")),
  description: Yup.string().required(emptyText("Description")),
});
