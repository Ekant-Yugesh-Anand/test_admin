import * as Yup from "yup";
import { emptyText } from "../../../../../constants/messages";

export const areaSchema = Yup.object({
  area: Yup.string().required(emptyText("area")),
  city: Yup.string().required(emptyText("city")),
  state: Yup.string().required(emptyText("state")),
  country: Yup.string().required(emptyText("country")),
  pincode: Yup.string().required(emptyText("pincode")),
});

export const unitSchema = Yup.object({
  units: Yup.string().required(emptyText("unit name")),
});

export const packageSchema = Yup.object({
  package: Yup.string().required(emptyText("package name")),
});

export const reasonSchema = Yup.object({
  reason_name: Yup.string().required(emptyText("reason name")),
  reason_type: Yup.string().required(emptyText("reason type")),
});

export const couponSchema = Yup.object({
  batch_name: Yup.string().required(emptyText("Coupon Name")),
  coupon_code: Yup.string().when("coupon_type", {
    is: "dynamic",
    then: Yup.string().required(emptyText("coupon code")).min(5, 'Must be 5 char long'),
  }),
  price: Yup.number().required(emptyText("Price")).max(Yup.ref("order_value")),
  valid_from: Yup.date().required(emptyText("Valid from")),
  valid_till: Yup.date()
    .required(emptyText("Valid till"))
    .min(Yup.ref("valid_from")),
  coupon_quantity: Yup.number().when("coupon_type", {
    is: "static",
    then: Yup.number().required(emptyText("No of Coupon")),
  }),
  user_qty: Yup.number().required(emptyText("usages allowed")),
  order_value: Yup.number().required(emptyText("Order value")),
  description: Yup.string().required(emptyText("Description")),
});

export const languageSchema = Yup.object({
  language: Yup.string().required(emptyText("Language")),
  lang_code: Yup.string().required(emptyText("Languge code")),
  language_native: Yup.string().required(emptyText("Language native")),
});

export const notificationSchema = Yup.object({
  notification: Yup.string().required(emptyText("notification")),
  message: Yup.string().required(emptyText("notification")),
  user: Yup.string().required(emptyText("notification")),
});

export const coupon_languge_schema = Yup.object({
  batch_name: Yup.string().required(emptyText("product title")),
  description: Yup.string().required(emptyText("product title")),
});
