import * as Yup from "yup";
import { emptyText, minText } from "../../../../constants/messages";

export const productSchema = Yup.object({
  sku_name: Yup.string()
    .min(2, minText("product name"))
    .max(255)
    .required(emptyText("product name")),
  sku_name_kannada: Yup.string()
    .min(2, minText("product kannada name"))
    .max(255)
    .required(emptyText("product kannada name")),

  category_id: Yup.string().required(emptyText("category")),
  subcategory_id: Yup.string().required(emptyText("subcategory")),
  brand_id: Yup.string().required(emptyText("brand")),
  crop_id:Yup.string().required(emptyText("crop id")),
  ingredient_id:Yup.string().required(emptyText("ingredient id"))

});

export const productPriceSchema = Yup.object({
  mrp: Yup.number().required(emptyText("product mrp")),
  gst: Yup.string().required(emptyText("product gst")),
  price: Yup.number().max(Yup.ref('mrp'), "Price should less than mrp").required(emptyText("product price")),

  dimension_height:Yup.number().required(emptyText("height")),
  dimension_width:Yup.number().required(emptyText("width")),
  dimension_length:Yup.number().required(emptyText("length")),
  package: Yup.string(),
  weight: Yup.string().required(emptyText("product weight")),
  // dimension: Yup.number(),
  totalweight: Yup.number().required(emptyText("actual weight")),
  units_per_case: Yup.string(),
});

export const productLanguageSchema = Yup.object({
  title: Yup.string().required(emptyText("product title")),
  description: Yup.string().required(emptyText("product title"))
})