import React from "react";
import { Typography } from "@mui/material";
import { Cell } from "react-table";
import { brandValidation, categoryValidation, dtypeValidation, packageValidation, subCategoryValidation, wieghtValidation, priceValidation, gstValidation, sku_id_validation, price_id_validation, sale_price_validation, cropValidation, ingredientValidation } from "../../admin/utils";

export default function CheckDataCell(props: {
  cell: Cell;
  dtype: "string" | "number" | "both";
  validate?: string;
}) {
  const {
    cell,
    cell: { value },
    dtype,
    validate
  } = props;
  const [validateRes, setValidateRes] = React.useState<{ message: string; error: boolean }>({
    error: false,
    message: ""
  })


  React.useEffect(() => {
    (async () => {
      if (validate) {
        switch (validate) {
          case "category":
            let c_res = await categoryValidation(value)
            setValidateRes(c_res)
            break;
          case "subCategory":
            let s_res = await subCategoryValidation(value)
            setValidateRes(s_res)
            break;
          case "brand":
            let b_res = await brandValidation(value)
            setValidateRes(b_res)
            break;

            case "crop":
            let crop_res = await cropValidation(value)
            setValidateRes(crop_res)
            break;
            case "ingredient":
            let ingredient_res = await ingredientValidation(value)
            setValidateRes(ingredient_res)
            break;
          case "package":
            let p_res = await packageValidation(value)
            setValidateRes(p_res)
            break;
          case "weight":
            let w_res = wieghtValidation(value)
            setValidateRes(w_res)
            break;
          case "price":
            let m_res = priceValidation(cell.row.values.mrp, value)
            setValidateRes(m_res)
            break;
          case "gst":
            let g_res = gstValidation(value)
            setValidateRes(g_res)
            break;
          case "sku_id":
            let sku_res = await sku_id_validation(value)
            setValidateRes(sku_res)
            break;
          case "price_id":
            let price_res = await  price_id_validation(value, cell.row.values.sku_id)
            setValidateRes(price_res)
            break;
          case "sale_price":
            let sprice_res = await sale_price_validation(value, cell.row.values.sku_id)
            setValidateRes(sprice_res)
            break;
          default:
            return
        }
      }
    })()
  }, [value])



  const { error, message } = React.useMemo(
    () => dtypeValidation(value, dtype),
    [value, dtype]
  );

  if (validateRes.error) {
    return <Typography fontSize="small" color="error">
      {validateRes.message}
    </Typography>
  }

  if (error) {
    return (
      <Typography fontSize="small" color="error">
        {message}
      </Typography>
    );
  }
  return <Typography fontSize="small">{value}</Typography>;
}
