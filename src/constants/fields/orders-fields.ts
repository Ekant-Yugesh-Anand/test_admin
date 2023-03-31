import { checkCancelOrderStatus } from "../../components/admin/utils";

export const allOrdersFields = [
  { label: "S.No", key: "s_no" },
  { label: "Invoice ID", key: "invoice_no" },
  { label: "Bill No", key: "suborder_no" },
  { label: "Order ID", key: "main_order_no" },
  { label: "Suborder No", key: "suborder_no" },
  { label: "Order Status", key: "order_status" },
  { label: "Order Date", key: "order_date" },
  { label: "Order Time", key: "order_time" },
  { label: "Sales Date", key: "delivered_date" },
  { label: "Sales Time", key: "delivered_time" },
  { label: "Farmer ID", key: "customer_auth_code" },
  { label: "Farmer Name", key: "customer_name" },
  { label: "Farmer Phone no", key: "customer_phone_no" },
  { label: "Billing Name", key: "billing_name" },
  { label: "Billing Phone No ", key: "billing_phone_no" },
  { label: "Billing Address", key: "farmer_billing_address" },
  { label: "Shipping Name", key: "shipping_name" },
  { label: "Shipping Phone No", key: "shipping_phone_no" },
  { label: "Shipping Address", key: "farmer_shipping_address" },
  { label: "Selected Retailer", key: "selected_retailer" },
  { label: "Selected Retailer Erp_Code", key: "retailer_erp_code" },
  { label: "Category", key: "category_name" },
  { label: "Sub_category", key: "subcategory_name" },
  { label: "SKU_Placed", key: "sku_name" },
  { label: "SKU_Code", key: "sku_code" },
  { label: "SKU_Size", key: "weight" },
  { label: "Package", key: "package" },
  { label: "Fragile", key: "fragile" },
  { label: "Quantity", key: "quantity" },
  { label: "Unit_Price ", key: "price" },
  { label: "SGST", key: "sgst" },
  { label: "SGST Amt", key: "sgst_amt" },
  { label: "CGST ", key: "cgst" },
  { label: "CGST Amt", key: "cgst_amt" },
  { label: "IGST", key: "igst" },
  { label: "IGST Amt", key: "igst_amt" },
  { label: "Total Tax Value", key: "tax_amount" },
  { label: "Total Taxable Value", key: "net_amount" },
  { label: "Coupon Code", key: "boucher_code" },
  { label: "Coupon Amount", key: "boucher_amount" },
  { label: "Total Value", key: "total_price" },
  { label: "Product_Volume(cm)", key: "dimension" },
  { label: "Product_Weight", key: "total_weight" },
  { label: "Delivery_charge ", key: "delivery_charge" },
  { label: "Delivery_discount ", key: "delivery_discount" },
  { label: "Amount Receive", key: "amount_receive" },
  { label: "Payment Method", key: "payment_method" },
  { label: "Delivered To", key: "delivered_to" },
  { label: "Payment_to", key: "payment_to" },
  { label: "Brand_name", key: "brand_name" },
  { label: "Accept Date", key: "accept_date" },
  { label: "Accept Time", key: "accept_time" },
  { label: "Cancel Date", key: "cancel_date" },
  { label: "Cancel Time", key: "cancel_time" },
  { label: "DS margin/Unit", key: "" },
  { label: "Cargill Margin(Amt.)", key: "cargill_margin_amount" },
  { label: "Cargill Margin(%)", key: "cargill_margin" },
  { label: "Payable to Retailer", key: "" },
  { label: "Unique farmer", key: "" },
  { label: "Unique order", key: "" },
  { label: "Unique SKUs", key: "" },
  { label: "Count of SKUS", key: "" },
  { label: "Repeating Farmers", key: "" },
  { label: "Date updated on", key: "" },
  { label: "Helper Column for Identifying repeating farmers", key: "" },
  { label: "Reason Name", key: "reason_name" },
  { label: "Reason Type", key: "type" },
  { label: "Other Reason", key: "other_reason" },
];

export const inputSaleDetailsFields = [
  { label: "S.No", key: "s_no" },
  { label: "Invoice ID", key: "invoice_no" },
  { label: "Bill No", key: "suborder_no" },
  { label: "Order ID", key: "main_order_no" },
  { label: "Suborder No", key: "suborder_no" },
  { label: "Order Date", key: "order_date" },
  { label: "Order Time", key: "order_time" },
  { label: "Order Status", key: "order_status" },
  { label: "Sales Date", key: "delivered_date" },
  { label: "Sales Time", key: "delivered_time" },
  { label: "Farmer ID", key: "customer_auth_code" },
  { label: "Farmer name", key: "customer_name" },
  { label: "Farmer Address", key: "" },
  { label: "Type", key: "" },
  { label: "Phone no", key: "customer_phone_no" },
  { label: "City", key: "" },
  { label: "State", key: "" },
  { label: "Area", key: "" },
  { label: "Farmer Billing Address", key: "farmer_billing_address" },
  { label: "Farmer Shipping Address", key: "farmer_shipping_address" },
  { label: "Selected Retailer", key: "selected_retailer" },
  { label: "Selected Retailer Erp Code", key: "retailer_erp_code" },
  { label: "User", key: "" },
  { label: "Reporting To", key: "" },
  { label: "Category", key: "category_name" },
  { label: "Sub category", key: "subcategory_name" },
  { label: "SKU Placed", key: "sku_name" },
  { label: "SKU Code", key: "sku_code" },
  { label: "SKU Size", key: "weight" },
  { label: "Package", key: "package" },
  { label: "Fragile", key: "fragile" },
  { label: "Quantity", key: "quantity" },
  { label: "Scheme", key: "" },
  { label: "Unit Price ", key: "price" },
  { label: "SGST", key: "sgst" },
  { label: "SGST Amt", key: "sgst_amt" },
  { label: "CGST ", key: "cgst" },
  { label: "CGST Amt", key: "cgst_amt" },
  { label: "IGST", key: "igst" },
  { label: "IGST Amt", key: "igst_amt" },
  { label: "Total Tax Value", key: "tax_amount" },
  { label: "Total Taxable Value", key: "net_amount" },
  { label: "Total Value", key: "total_price" },
  { label: "Delivery_charge ", key: "delivery_charge" },
  { label: "Delivery_discount ", key: "delivery_discount" },
  { label: "Amount Receive", key: "amount_receive" },
  { label: "Payment Method", key: "payment_method" },
  { label: "Delivered To", key: "delivered_to" },
  { label: "Payment_to", key: "payment_to" },
  { label: "Brand_name", key: "brand_name" },
  { label: "DS margin/Unit", key: "" },
  { label: "Cargill Margin(Amt.)", key: "cargill_margin_amount" },
  { label: "Cargill Margin(%)", key: "cargill_margin" },
  { label: "Payable to Retailer", key: "" },
  { label: "Unique farmer", key: "" },
  { label: "Unique order", key: "" },
  { label: "Unique SKUs", key: "" },
  { label: "Count of SKUS", key: "" },
  { label: "Repeating Farmers", key: "" },
];

// "Reason Name","Reason Type","Other Reason"

export const ordersFields = (orderStatus: string) => [
  { label: "S.No", key: "s_no" },
  { label: "Invoice_ID", key: "invoice_no" },
  { label: "Bill_No", key: "suborder_no" },
  { label: "Order ID", key: "main_order_no" },
  { label: "Suborder No", key: "suborder_no" },
  { label: "Order_Date", key: "order_date" },
  { label: "Order_Time", key: "order_time" },
  { label: "Order Status", key: "order_status" },
  { label: "Sales_Date", key: "delivered_date" },
  { label: "Sales_Time", key: "delivered_time" },
  { label: "Farmer_ID", key: "customer_auth_code" },
  { label: "Famer_Name", key: "customer_name" },
  { label: "Farmer Phone No", key: "customer_phone_no" },
  { label: "Billing Name", key: "billing_name" },
  { label: "Billing Phone No ", key: "billing_phone_no" },
  { label: "Billing Address", key: "farmer_billing_address" },
  { label: "Shipping Name", key: "shipping_name" },
  { label: "Shipping Phone No", key: "shipping_phone_no" },
  { label: "Shipping Address", key: "farmer_shipping_address" },
  { label: "Selected_Retailer", key: "selected_retailer" },
  { label: "Selected_Retailer_Erp_Code", key: "retailer_erp_code" },
  { label: "Category", key: "category_name" },
  { label: "Sub_category", key: "subcategory_name" },
  { label: "User", key: "" },
  { label: "Reporting_To", key: "" },
  { label: "SKU_Placed", key: "sku_name" },
  { label: "SKU_Code", key: "sku_code" },
  { label: "SKU_Size", key: "weight" },
  { label: "Package", key: "package" },
  { label: "Fragile", key: "fragile" },
  { label: "Quantity", key: "quantity" },
  { label: "Scheme ", key: "" },
  { label: "Unit_Price ", key: "price" },
  { label: "SGST", key: "sgst" },
  { label: "SGST Amt", key: "sgst_amt" },
  { label: "CGST ", key: "cgst" },
  { label: "CGST Amt", key: "cgst_amt" },
  { label: "IGST", key: "igst" },
  { label: "IGST Amt", key: "igst_amt" },
  { label: "Total Tax Value", key: "tax_amount" },
  { label: "Total Taxable Value", key: "net_amount" },
  { label: "Coupon Code", key: "boucher_code" },
  { label: "Coupon Amount", key: "boucher_amount" },
  { label: "Product Volume(cm)", key: "dimension" },
  { label: "Product Weight", key: "total_weight" },
  { label: "Total Value", key: "total_price" },
  { label: "Delivery_charge ", key: "delivery_charge" },
  { label: "Delivery_discount ", key: "delivery_discount" },
  { label: "Amount Receive", key: "amount_receive" },
  { label: "Payment Method", key: "payment_method" },
  { label: "Delivered To", key: "delivered_to" },
  { label: "Payment_to", key: "payment_to" },
  { label: "Brand_name", key: "brand_name" },
  { label: "Accept Date", key: "accept_date" },
  { label: "Accept Time", key: "accept_time" },
  { label: "Cancel Date", key: "cancel_date" },
  { label: "Cancel Time", key: "cancel_time" },
  { label: "DS margin/Unit", key: "" },
  { label: "Cargill Margin(Amt.)", key: "cargill_margin_amount" },
  { label: "Cargill Margin(%)", key: "cargill_margin" },
  { label: "Payable to Retailer", key: "" },
  { label: "Unique farmer", key: "" },
  { label: "Unique order", key: "" },
  { label: "Unique SKUs", key: "" },
  { label: "Count of SKUS", key: "" },
  { label: "Repeating Farmers", key: "" },
  { label: "Date updated on", key: "" },
  { label: "Helper Column for Identifying repeating farmers", key: "" },

  ...(checkCancelOrderStatus(orderStatus)
    ? [
        { label: "Reason Name", key: "reason_name" },
        { label: "Reason Type", key: "type" },
        { label: "Other Reason", key: "other_reason" },
      ]
    : []),
];
