import { baseUrlImg } from "../config";
import { api2, baseFunc } from "./server-base";

// list of all the endpoints of farmers
export const farmers = baseFunc("shop_customer");
// list of all the endpoints of shop_warehouses
export const warehouse = baseFunc("shop_warehouses");
// list of all the endpoints of shop_retailer
export const retailer = baseFunc("shop_retailer");
// list of all the endpoints of shop_categories
export const categories = baseFunc("shop_categories");
// list of all the endpoints of shop_subcategories
export const subCategories = baseFunc("shop_subcategories");
// list of all the endpoints of shop_brands
export const brands = baseFunc("shop_brands");
// list of all the endpoints of shop_crops
export const crops = baseFunc("shop_crops");
// list of all the endpoints of shop_deliverypartners
export const deliveryPartners = baseFunc("shop_deliverypartners");
// list of all the endpoints of shop_deliveryretailer
export const deliveryRetailer = baseFunc("shop_deliveryretailer");
export const shopDeliveryAgent = baseFunc("shop_deliveryagents");
// list of all the endpoints of shop_products
export const shopProducts = baseFunc("shop_products");
export const shopProductDetails = baseFunc("shop_productdetails")
// list of all the endpoints of shop_productweightprice
export const shopProductWeightPrice = baseFunc("shop_productweightprice");
// list of all the endpoints of shop_productimages
export const shopProductImages = baseFunc("shop_productimages");
// list of all the endpoints of shop_packages
export const shopPackages = baseFunc("shop_packages");
// list of all endpoints of coupans
export const shopCoupons = baseFunc("shop_coupons")
// list of all endpoints of coupans
export const shopCoupontranslation = baseFunc("shop_coupontranslation")
// list of all the endpoints of shop_units
export const shopUnits = baseFunc("shop_units");
// list of all endpoints of language 
export const shopLanguages = baseFunc("shop_languages")
// list of all the endpoints of shop_areas
export const shopAreas = baseFunc("shop_areas");
// list of all the endpoints of shop_orders
export const shopOrders = baseFunc("shop_orders");
export const shopOrderLog = baseFunc("shop_orderlog")
// list of all the endpoints of shop_ordercart
export const shopCart = baseFunc("shop_ordercart");
//tempororary function to get total framer serviced
export const shopOrderFarmer = baseFunc("shop_orders?order_status=5")

export const shopOrderDetails = baseFunc("shop_orderdetails");
//list of all the endpoints of shopIngredients
export const shopIngredients = baseFunc("shop_ingredients")
//list of all the endpoints of notification
export const shopNotification= baseFunc("shop_notifications")
//list of all the endpoints of notificationLog
export const shopNotificationLog = baseFunc("shop_notificationlog")
// list of all endpoints of shop_retailercategories
export const shopRetailerCategories = baseFunc("shop_retailercategories")
// list of all endpoints of shop_materialpackage
export const shopMaterialPackage = baseFunc("shop_materialpackage")
// list of all endpoints of shop_retailermaterialpackage
export const shopRetailerMaterialPackage = baseFunc("shop_retailermaterialpackage")


// Retailer Dashboard api's
export const shopRetailerProductPrice = baseFunc("shop_retailerproductprice");
export const shopAssignRetailerProducts = baseFunc(
  "shop_assignretailerproducts"
);
export const shopRetailerArea = baseFunc("shop_retailerareas");
export const shopPartnerArea = baseFunc("shop_partnerareas");
// shop banner api
export const shopBanner = baseFunc("shop_banners");
// refreshToken api
export const shopRefreshToken = baseFunc("shop_tokenrefresh")
// notification api
export const shopAdmin = baseFunc("shop_admin")



export const shopImgDownLoad = (img: any) =>
  api2.request({
    url: `${baseUrlImg}${img || ""}`,
    method: "GET",
    responseType: "blob",
    headers: {
      Accept: "*/*",
    },
  });



// shop delivery charge api
export const shopDeliveryCharge = baseFunc("shop_deliverycharges");

// shop reason
export const shopReason = baseFunc("shop_reason");
