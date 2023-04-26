import * as Yup from "yup";
import { emptyText, minText } from "../../../../constants/messages";

export const productSchema = Yup.object({
  sku_name: Yup.string()
    .min(2, minText("Product name"))
    .max(255)
    .required(emptyText("Product name")),
  sku_name_kannada: Yup.string()
    .min(2, minText("Product kannada name"))
    .max(255)
    .required(emptyText("Product kannada name")),
  category_id: Yup.string().required(emptyText("Category")),
  subcategory_id: Yup.string().required(emptyText("Subcategory")),
  brand_id: Yup.string().required(emptyText("Brand")),
  crop_id:Yup.string().required(emptyText("Crop id")),
  ingredient_id:Yup.string().required(emptyText("Ingredient id")),


});

export const productPriceSchema = Yup.object({
  mrp: Yup.number().positive().required(emptyText("Product MRP")),
  gst: Yup.string().required(emptyText("Product GST")),
  price: Yup.number().positive().max(Yup.ref('mrp'), "Price should less than mrp").required(emptyText("Product price")),

  dimension_height:Yup.number().required(emptyText("Height")),
  dimension_width:Yup.number().required(emptyText("Width")),
  dimension_length:Yup.number().required(emptyText("Length")),
  package: Yup.string(),
  weight: Yup.string().required(emptyText("Product weight")),
  // dimension: Yup.number(),
  totalweight: Yup.number().required(emptyText("Actual weight")),
  units_per_case: Yup.string(),
});

export const productLanguageSchema = Yup.object({
  title: Yup.string().required(emptyText("Product title")),
  description: Yup.string().required(emptyText("Product title"))
})