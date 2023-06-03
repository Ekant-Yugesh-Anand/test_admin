import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToWords } from "to-words";
import dayjs from "dayjs";
import { getPos, getStrOrderStatus } from "../../constants/messages";
import {
  brands,
  categories,
  crops,
  shopPackages,
  shopProducts,
  shopProductWeightPrice,
  subCategories,
} from "../../http";
import CustomParserFormat from "dayjs/plugin/customParseFormat";
import { shopIngredients } from "../../http/server-api/server-apis";

export const getPayload = (
  original: { [key: string]: any },
  payload?: Array<string>
) => {
  let result: { [key: string]: any } = {};
  if (payload) {
    payload?.map((item) => {
      result[item] = original[item];
    });
  }
  return result;
};

export const removePostFix = (value: string): any => {
  const reg = /([\d]+(?:\.[\d]+)?(?![\d]))|([a-z.]+)(?![a-z.])/gi;
  return value.match(reg) || ["", ""];
};

export const margeObj = (
  init: { [key: string]: any },
  data: { [key: string]: any }
) => {
  let newObj: { [key: string]: any } = {};
  Object.keys(init).forEach((key) => {
    newObj[key] = data[key] === null ? "" : data[key];
  });
  return newObj;
};

export const queryToStr = (queryObj: { [key: string]: any }) => {
  const query = [];
  for (const key in queryObj) {
    query.push(
      encodeURIComponent(key)
        .concat("=")
        .concat(encodeURIComponent(queryObj[key]))
    );
  }
  return query.length ? query.join("&") : "";
};

export const nullFree = (value: any) => {
  if (value === undefined || value === null) return 0;
  return value;
};

export const reactToPdf = async (ref: any, saveName: string) => {
  const canvas = await html2canvas(ref);
  const data = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4", false);
  const imgProperties = pdf.getImageProperties(data);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(saveName);
};

export const totalGst = (totalAmount: number, igst: string) => {
  const i = parseFloat(igst);
  const igstNum = isNaN(i) ? 0 : i;
  return {
    gst: totalAmount / (1 + igstNum / 100),
    igstNum,
  };
};

export function numberToEnIn(value: string): string {
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  const num = Number(value);
  if (isNaN(num)) {
    return "Zero";
  }
  return toWords.convert(num, {
    doNotAddOnly: true,
  });
}

export const filterPhoneNo = (phone: string, r91?: boolean) => {
  if (phone) {
    const spaceFree = phone.replace(/\s/g, "");
    return r91
      ? spaceFree.replace("+91", "")
      : spaceFree.includes("+91")
      ? spaceFree
      : "+91" + spaceFree;
  }
  return "";
};

export const round2 = (value: number | string | null | undefined) => {
  if (typeof value === "string") {
    const conNm = parseFloat(value);
    return !isNaN(conNm) ? conNm.toFixed(2) : 0.0;
  } else if (typeof value === "number") return value.toFixed(2);
  return 0.0;
};

// !Table Units Start

export const addSno = (
  data: Array<Record<string, any>>,
  keyName: string = "s_no"
) =>
  data.map((row, index) => ({
    [keyName]: index + 1,
    ...row,
  }));

export const orderStatusReadable = (
  data: Array<Record<string, any>>,
  extractName: string = "order_status",
  addKeyName: string = "order_status"
) =>
  data.map((row) => ({
    ...row,
    [addKeyName]: getStrOrderStatus(`${row[extractName]}`,`${row["return_order_status"]}`),
  }));

export const dateTimeFormatTable = (
  data: Array<Record<string, any>>,
  dateExtractKeyName: string,
  addTimeKeyName: string
) =>
  data.map((row) =>
    row[dateExtractKeyName]
      ? {
          ...row,
          [dateExtractKeyName]: dayjs(row[dateExtractKeyName]).format(
            "DD-MMM-YYYY"
          ),
          [addTimeKeyName]: dayjs(row[dateExtractKeyName]).format("hh:mm A"),
        }
      : row
  );

export const margeRowTable = (
  data: Array<Record<string, any>>,
  whoMarge: Array<string>,
  nameOfCol: string
) =>
  data.map((row) => ({
    ...row,
    [nameOfCol]: whoMarge.reduce((p, c) =>
      whoMarge[0] === p && whoMarge[1] === c
        ? `${row[p] ? row[p] : ""} (${row[c] ? row[c] : ""})`
        : `${p ? p : ""} (${row[c] ? row[c] : ""})`
    ),
  }));

export const addTaxNetAmount = (
  data: Array<Record<string, any>>,
  taxKeyName: string = "tax_amount",
  netKeyName: string = "net_amount"
) =>
  data.map((row) => {
    const both = row?.retailer_state === row?.billing_state;
    const { gst, igstNum } = totalGst(
      nullFree(row?.total_price),
      nullFree(row?.igst)
    );
    if (igstNum !== 0) {
      const netAmount = gst;
      const taxAmount = nullFree(row?.total_price) - gst;
      return {
        ...row,
        [taxKeyName]: taxAmount.toFixed(2),
        [netKeyName]: netAmount.toFixed(2),
        ...(both
          ? {
              sgst_amt: (taxAmount / 2).toFixed(2),
              cgst_amt: (taxAmount / 2).toFixed(2),
              igst_amt: "",
              igst: "",
            }
          : {
              sgst: "",
              cgst: "",
              sgst_amt: "",
              cgst_amt: "",
              igst_amt: taxAmount.toFixed(2),
            }),
      };
    } else {
      return {
        ...row,
        [taxKeyName]: 0,
        [netKeyName]: row?.total_price,
        ...(both
          ? {
              sgst_amt: 0,
              cgst_amt: 0,
              igst_amt: "",
              igst: "",
            }
          : {
              sgst: "",
              cgst: "",
              sgst_amt: "",
              cgst_amt: "",
              igst_amt: 0,
            }),
      };
    }
  });

export const margeAsList = (
  data: Array<Record<string, any>>,
  whoMarge: Array<string>,
  nameOfCol: string
) =>
  data.map((row) => ({
    ...row,
    [nameOfCol]: whoMarge.map((value) => row[value] || ""),
  }));

export const setExtraValue = (
  data: Array<Record<string, any>>,
  keyName: string,
  setName: string
) =>
  data.map((row) => ({
    ...row,
    [keyName]: setName,
  }));

export const setOrderStatusValue = (
  data: Array<Record<string, any>>,
  keyName: string,
  orderStatus: string,
  retunStatus?: string
) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        newRow["order_status"] =
          orderStatus == "21"
            ? getStrOrderStatus(row["order_status"], row["return_order_status"])
            : getStrOrderStatus(orderStatus, row["return_order_status"]);
      }
    }
    return { ...row, ...newRow };
  });

export const removeEsc = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        if (typeof row[key] === "string") {
          newRow[key] = row[key].replace(/\t/g, " ").replace(/\n/g, " ");
        }
      }
    }
    return { ...row, ...newRow };
  });

export const addComma = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        newRow["suborder_no"] = ` ${row["suborder_no"]}`;
      }
    }
    return { ...row, ...newRow };
  });

export const formatWeight = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        newRow["total_weight"] =
          row["total_weight"] > 0
            ? row["total_weight"] < 999
              ? `${row["total_weight"]}gm`
              : `${row["total_weight"] / 1000}kg`
            : "";
      }
    }
    return { ...row, ...newRow };
  });

export const formatVolume = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        newRow["dimension"] =
          row["dimension"] > 0 ? ` ${row["dimension"]}cm³` : "";
      }
    }
    return { ...row, ...newRow };
  });

export const calculateMargin = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        newRow["margin_amount"] = row["margin"]
          ? ` ${((+row["price"] * +row["margin"]?.split("%")[0]) / 100).toFixed(
              2
            )}`
          : "0";
      }
    }
    return { ...row, ...newRow };
  });

export const getQunatityInStock = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        newRow["qty_in_stock"] =
          row["quantity"] > 0 ? +row["quantity"] - +row["used_quantity"] : "0";
      }
    }
    return { ...row, ...newRow };
  });

export const getFragile = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        newRow["fragile"] = row["fragile"] == 1 ? `Yes` : "No";
      }
    }
    return { ...row, ...newRow };
  });

// !Table Units End

export const objectToForm = (obj: Record<string, any>) => {
  const formData = new FormData();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
};

export function checkCancelOrderStatus(status: string) {
  const value: Array<string> = [
    "7",
    "9",
    "10",
    "11",
    "13",
    "15",
    "11,13,15",
    "7,9,10",
  ];
  for (const iterator of value) {
    if (status === iterator) {
      return true;
    }
  }
  return false;
}

export function dtypeValidation(
  value: any,
  dtype: "number" | "string" | "both"
) {
  if (dtype === "number") {
    if (typeof value === "number") {
      if (value < 0)
        return { error: true, message: "value should be positive" };
    } else {
      return { error: true, message: "data required" };
    }
  } else if (dtype === "string") {
    if (typeof value === "string") {
      if (!value) return { error: true, message: "not allowed to be empty" };
    } else {
      return { error: true, message: "data required" };
    }
  } else if (dtype === "both") {
    if (!value) return { error: true, message: "not allowed to be empty" };
  }
  return { error: false, message: "" };
}

//  weight validation

export function wieghtValidation(value: any) {
  const weight_parameter = [
    "gm",
    "liter",
    "kg",
    "ml",
    "Gm",
    "Liter",
    "Kg",
    "Ml",
  ];
  if (value.slice(-5) == "liter" || value.slice(-5) == "Liter" || value.slice(-5) == "litre" || value.slice(-5) == "Litre") {
    return { error: false, message: "" };
  }
  if (!weight_parameter.includes(value.slice(-2))) {
    return { error: true, message: "Weight parameter is not correct" };
  }
  return { error: false, message: "" };
}

//  used_quantity validation

export function usedQuantityValidation(quantity: number, used: number) {
  if (quantity < used) {
    return {
      error: true,
      message: "Used Quantity should be less than quantity",
    };
  }
  return { error: false, message: "" };
}

//  category validation
export async function categoryValidation(value: any) {
  try {
    await categories("get", {
      params: `${value}`,
    });
  } catch (err) {
    return { error: true, message: "Category is not valid" };
  }

  return { error: false, message: "" };
}

//  sub-category validation
export async function subCategoryValidation(value: any) {
  try {
    await subCategories("get", {
      params: `${value}`,
    });
  } catch (err) {
    return { error: true, message: "Sub-Category is not valid" };
  }

  return { error: false, message: "" };
}

//  brand validation
export async function brandValidation(value: any) {
  try {
    await brands("get", {
      params: `${value}`,
    });
  } catch (err) {
    return { error: true, message: "Brand is not valid" };
  }

  return { error: false, message: "" };
}

//  crop validation
export async function cropValidation(value: any) {
  try {
    let crop_res = await crops("get", {
      params: `validate`,
      postfix: `?crop_id=${value}`,
    });
    if (crop_res?.data?.status === "failure") {
      return {
        error: true,
        message: crop_res?.data?.message || "Crop is not valid",
      };
    }
  } catch (err) {
    return { error: true, message: "Crop is not valid" };
  }
  return { error: false, message: "" };
}
//  ingredient validation
export async function ingredientValidation(value: any) {
  try {
    let ingredient_res = await shopIngredients("get", {
      params: `validate`,
      postfix: `?ingredient_id=${value}`,
    });
    if (ingredient_res?.data?.status === "failure") {
      return {
        error: true,
        message: ingredient_res?.data?.message || "Ingredient is not valid",
      };
    }
  } catch (err) {
    return { error: true, message: "Ingrdient is not valid" };
  }
  return { error: false, message: "" };
}


//  package validation
export async function packageValidation(value: any) {
  try {
    await shopPackages("get", {
      params: `${value}`,
    });
  } catch (err) {
    return { error: true, message: "Package is not valid" };
  }

  return { error: false, message: "" };
}

// price validatation

export const priceValidation = (
  mrp: string | number,
  price: string | number
) => {
  if (price > mrp) {
    return { error: true, message: "Price should be less than mrp" };
  }
  return { error: false, message: "" };
};

// gst validation
export const gstValidation = (gst: string | number) => {
  const gstSlab = ["0%", "5%", "12%", "18%", 0, 5, 12, 18];
  if (!gstSlab.includes(gst)) {
    return { error: true, message: "Gst is not valid" };
  }
  return { error: false, message: "" };
};

//sku_id validation

export async function sku_id_validation(value: any) {
  try {
    let res = await shopProducts("get", { params: value });
    if (res?.data[0]?.sku_id !== value) {
      return { error: true, message: "Sku id is not valid" };
    }
  } catch (err) {
    return { error: true, message: "Sku id is not valid" };
  }

  return { error: false, message: "" };
}

//price_id_validation

export async function price_id_validation(price_id: any, sku_id: any) {
  try {
    let res = await shopProductWeightPrice("get", {
      postfix: `?sku_id=${sku_id}`,
    });
    if (res?.data[0]?.price_id !== price_id) {
      return { error: true, message: "Price_id is not valid" };
    }
  } catch (err) {
    return { error: true, message: "Price_id is not valid" };
  }

  return { error: false, message: "" };
}

//price_id_validation

export async function sale_price_validation(price: any, sku_id: any) {
  try {
    let res = await shopProductWeightPrice("get", {
      postfix: `?sku_id=${sku_id}`,
    });
    if (parseInt(res?.data[0]?.mrp) < parseInt(price)) {
      return { error: true, message: "Price should be less than MRP" };
    }
  } catch (err) {
    return { error: true, message: "Price_id is not valid" };
  }

  return { error: false, message: "" };
}

// get diffrent category

export const getCategory = async (category_name: string | number) => {
  try {
    let categoryResponse = await categories("get", {
      params: `check?category=${category_name}`,
    });

    if (categoryResponse?.data) {
      return categoryResponse.data.category_id;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
export const getSubCategory = async (
  sub_category_name: string | number,
  categoryId: number
) => {
  try {
    let subCategoryResponse = await subCategories("get", {
      params: `check?subcategory=${sub_category_name}&category_id=${categoryId}`,
    });

    if (subCategoryResponse?.data) {
      return subCategoryResponse.data.category_id;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const getBrand = async (brand_name: string | number) => {
  try {
    let brandResponse = await brands("get", {
      params: `check?brand=${brand_name}`,
    });

    if (brandResponse?.data) {
      return brandResponse.data.brand_id;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const getPackage = async (package_name: string | number) => {
  try {
    let pakageResponse = await shopPackages("get", {
      params: `check?package=${package_name}`,
    });
    if (pakageResponse?.data) {
      return pakageResponse.data.package_id;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const manipulateGst = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        if (row["delivery_charge"]) {
          newRow["igst"] = "18%";
          newRow["cgst"] = "9%";
          newRow["sgst"] = "9%";
          newRow["taxable_value"] = (
            (row["delivery_charge"] * 100) /
            118
          ).toFixed(2);
          newRow["igst_amt"] = (
            (((row["delivery_charge"] * 100) / 118) * 18) /
            100
          ).toFixed(2);
          newRow["cgst_amt"] = (
            (((row["delivery_charge"] * 100) / 118) * 9) /
            100
          ).toFixed(2);
          newRow["sgst_amt"] = (
            (((row["delivery_charge"] * 100) / 118) * 9) /
            100
          ).toFixed(2);
        }
        row["document_type"] = "Invoice";
        row["hsn"] = "999999";
        row["supplierGSTIN"] = "29AAACC3269J1ZG";
        row["customerGSTIN"] = "Not Registered";
        row["customer_code"] = "NA";
        row["reserve_charge_flag"] = "N";
      }
    }
    return { ...row, ...newRow };
  });

export const getTaxationValue = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        if (row["grand_cargill_margin_amount"]) {
          newRow["ds_margin_gst"] = (
            +row["grand_cargill_margin_amount"] * 0.18
          ).toFixed(2);
          newRow["ds_payable"] = (
            +newRow["ds_margin_gst"] + +row["grand_cargill_margin_amount"]
          ).toFixed(2);
        }
        newRow["tds"] = row["grand_total"] * 0.01;
        newRow["tcs"] = row["grand_total"] * 0.01;
        newRow["ret_payable"] = (
          +row["grand_total"] -
          (+row["grand_total"] * 0.02 +
            +newRow["ds_margin_gst"] +
            +row["grand_cargill_margin_amount"])
        ).toFixed(2);
      }
    }
    return { ...row, ...newRow };
  });
