import * as Yup from "yup";
import { emptyText } from "../../../../constants/messages";

export const deliveryPartnerSchema = Yup.object({
  partner_name: Yup.string()
    .min(2)
    .max(255)
    .required(emptyText("partner name")),
  phone_no: Yup.string().matches(
    /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/,
    {
      message: "Invalid Phone number",
      excludeEmptyString: false,
    }
  ),
  email_id: Yup.string().email().required(emptyText("email")),
  pincode: Yup.string()
    .max(6, "Invalid pincode")
    .required(emptyText("pincode")),
});

export const deliveryAgentSchema = Yup.object({
  agent_name: Yup.string().min(2).max(255).required(emptyText("agent name")),
  email_id: Yup.string().email().required(emptyText("email")),
  phone_no: Yup.string()
    .matches(
      /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/,
      {
        message: "Invalid Phone number",
        excludeEmptyString: false,
      }
    )
    .required(emptyText("phone no")),
});
