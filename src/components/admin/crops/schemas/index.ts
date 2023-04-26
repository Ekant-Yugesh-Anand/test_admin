import * as Yup from "yup";
import { emptyText } from "../../../../constants/messages";
export const cropSchema = Yup.object({
    crop_name: Yup.string().required(emptyText("Crop name")),
  });
  