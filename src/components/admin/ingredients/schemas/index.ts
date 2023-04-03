import * as Yup from "yup";
import { emptyText } from "../../../../constants/messages";
export const ingredientSchema = Yup.object({
    ingredient_name: Yup.string().required(emptyText("ingredient name")),
  });
  