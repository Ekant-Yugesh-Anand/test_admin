import * as Yup from "yup";
import { emptyText } from "../../../../constants/messages";
export const advisoryPackageSchema = Yup.object({
  package_name: Yup.string().required(emptyText("Package name")),
  gst: Yup.string().required(emptyText("gst")),
  price: Yup.number().required(emptyText("Price")),
  cargill_margin_amount: Yup.number().required(
    emptyText("Cargill Margin Amount")
  ),
  cargill_margin: Yup.string().required(emptyText("Cargill Margin")),
  vendor_margin_amount: Yup.number().required(
    emptyText("Vendor Margin Amount")
  ),
  vendor_margin: Yup.string().required(emptyText("Vendor Margin")),
});

export const invoiceSchema = Yup.object({
  farmer_name: Yup.string().required(emptyText("Farmer name")),
  package: Yup.string().required(emptyText("package")),
  mobile_no: Yup.number().required(emptyText("Mobile number")),
  subscribred_crop: Yup.string(),
  village: Yup.string().required(emptyText("Village")),
  area: Yup.string().required(emptyText("area")),
  sub_district: Yup.string().required(emptyText("sub_district")),
  district: Yup.string().required(emptyText("district")),
  payment_date: Yup.date(),
  payment_mode: Yup.string(),
  paid_amount: Yup.number().required(emptyText("paid amount")),
  collected_by: Yup.string(),
});
