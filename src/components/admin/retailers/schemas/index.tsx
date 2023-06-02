import * as Yup from "yup";
import { emptyText, minText } from "../../../../constants/messages";

export const retailerSchema = Yup.object({
  retailer_name: Yup.string()
    .min(2, minText("Retailer name"))
    .max(255)
    .required(emptyText("Retailer name")),
  company_name: Yup.string()
    .min(2, minText("Retailer name"))
    .max(255)
    .required(emptyText("Company name")),
  email_id: Yup.string().email().required(emptyText("Email")),
  phone_no: Yup.string().matches(
    /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/,
    {
      message: "Invalid Phone number",
      excludeEmptyString: false,
    }
  ),
  
  pincode: Yup.string()
    .max(6, "Invalid pincode")
    .required(emptyText("Pincode")),
  state:Yup.string().required(emptyText("state")),
  district:Yup.string().required(emptyText("district")),
  city:Yup.string().required(emptyText("city"))

  // margin: Yup.number(),
});

export const categorySchema = Yup.object({
  category_id: Yup.string().required(emptyText("Category")),
  subcategory_id: Yup.string().required(emptyText("Subcategory")),
  margin:Yup.string().required(emptyText("Margin"))
})

export const marginSchema = Yup.object({
  margin:Yup.string().required(emptyText("Margin"))
})

export const retailerMaterialSchema = Yup.object({
  material_id: Yup.string().required(emptyText("Material_id")),
  quantity: Yup.number().required(emptyText("Quantity")),
  remark:Yup.string()
})