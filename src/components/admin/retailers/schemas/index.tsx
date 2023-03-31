import * as Yup from "yup";
import { emptyText, minText } from "../../../../constants/messages";

export const retailerSchema = Yup.object({
  retailer_name: Yup.string()
    .min(2, minText("retailer name"))
    .max(255)
    .required(emptyText("retailer name")),
  company_name: Yup.string()
    .min(2, minText("retailer name"))
    .max(255)
    .required(emptyText("company name")),
  email_id: Yup.string().email().required(emptyText("email")),
  phone_no: Yup.string().matches(
    /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/,
    {
      message: "Invalid Phone number",
      excludeEmptyString: false,
    }
  ),
  pincode: Yup.string()
    .max(6, "invalid pincode")
    .required(emptyText("pincode")),
  // margin: Yup.number(),
});

export const categorySchema = Yup.object({
  category_id: Yup.string().required(emptyText("category")),
  subcategory_id: Yup.string().required(emptyText("subcategory")),
  margin:Yup.string().required(emptyText("margin"))
})

export const marginSchema = Yup.object({
  margin:Yup.string().required(emptyText("margin"))
})

export const retailerMaterialSchema = Yup.object({
  material_id: Yup.string().required(emptyText("material_id")),
  quantity: Yup.number().required(emptyText("quantity")),
  remark:Yup.string()
})