import {
  TbBrandSublimeText,
  TbCurrencyRupee,
  TbDiscount2,
  // TbCurrencyRupee,
  // TbReportAnalytics,
  TbTruckDelivery,
  // TbTruckReturn,
} from "react-icons/tb";
import {
  FaBorderAll,
  FaClipboardCheck,
  FaFileAlt,
  FaRupeeSign,
  FaShippingFast,
  FaTractor,
  FaUserPlus,
  // FaUsers,
  FaUserTie,
  FaBoxes,
  FaPeopleCarry,
  FaShoppingCart,
  FaAlignCenter,
  FaMapMarkedAlt,
  FaFileInvoice,
} from "react-icons/fa";
import {
  BsBookmarkCheckFill,
  // BsFileEarmarkCheckFill,
  // BsGraphUp,
  BsJournalBookmark,
  BsMailbox,
  BsPercent,
  BsShopWindow,
  BsUiRadiosGrid,
} from "react-icons/bs";
import {
  MdAddShoppingCart,
  MdDeliveryDining,
  MdFreeCancellation,
  MdMargin,
  MdOutlineAccountTree,
  MdOutlineCardGiftcard,
  MdOutlineDoNotDisturb,
  MdOutlinePending,
  MdOutlineShoppingCart,
  MdProductionQuantityLimits,
  MdRemoveShoppingCart,
  MdUpdate,
  // MdSave,
} from "react-icons/md";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { VscNewFile, VscReferences, VscReport } from "react-icons/vsc";
import { TiTicket } from "react-icons/ti";
import { FcProcess } from "react-icons/fc";
import { GiChemicalTank, GiDiscussion, GiStorkDelivery, GiWheat } from "react-icons/gi";
import { HiChartPie } from "react-icons/hi";
import { SiReason } from "react-icons/si";
import { IoLanguage, IoNotificationsSharp } from "react-icons/io5";
import { AiTwotoneNotification } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";

const sideBarMainList = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: <HiChartPie />,
  },
  // {
  //   href: "/auth0-users",
  //   title: "Auth0 Users",
  //   icon: <FaUsers />,
  // },
  {
    title: "Management",
    icon: <FaUserPlus />,
    child: [
      {
        href: "/management/categories",
        title: "Categories",
        icon: <MdOutlineAccountTree />,
      },
      {
        href: "/management/brands",
        title: "Brands",
        icon: <TbBrandSublimeText />,
      },
      {
        href: "/management/crops",
        title: "Crops",
        icon: <GiWheat />,
      },
      {
        href: "/management/ingredients",
        title: "Ingredients",
        icon: <BsUiRadiosGrid />,
      },
      {
        href: "/management/chemical",
        title: "Chemicals",
        icon: <GiChemicalTank />,
      },
      {
        href: "/management/products",
        title: "Products",
        icon: <MdProductionQuantityLimits />,
      },
      {
        href: "/management/farmers",
        title: "Farmers",
        icon: <FaTractor />,
      },
      {
        href: "/management/retailers",
        title: "Retailers",
        icon: <BsShopWindow />,
      },
      {
        href: "/management/delivery-partners",
        title: "Delivery Partners",
        icon: <FaPeopleCarry />,
      },
      {
        href: "/management/trending-products",
        title: "Trending Products",
        icon: <FaBoxes />,
      },
      {
        href: "/management/delivery-charges",
        title: "Delivery Charges",
        icon: <TbTruckDelivery />,
      },
    ],
  },
  {
    title: "Master",
    icon: <FaUserTie />,
    child: [
      {
        href: "/masters/packages",
        title: "Packages",
        icon: <RiShoppingBag3Fill />,
      },
      {
        href: "/masters/units",
        title: "Units",
        icon: <FaBoxes />,
      },
      {
        href: "/masters/areas",
        title: "Areas",
        icon: <FaMapMarkedAlt />,
      },
      {
        href: "/masters/banner",
        title: "Banner",
        icon: <BsMailbox />,
      },
      {
        href: "/masters/reason",
        title: "Reason",
        icon: <SiReason />,
      },
      {
        href: "/masters/languages",
        title: "Languages",
        icon: <IoLanguage />,
      },
      {
        href: "/masters/coupon",
        title: "Coupon",
        icon: <TbDiscount2 />,
      },
      {
        href: "/masters/notification",
        title: "Notification",
        icon: < IoNotificationsSharp/>,
      },
      {
        href: "/masters/packaging-material",
        title: "Packaging Material",
        icon: < MdOutlineCardGiftcard/>,
      },
    ],
  },
  {
    title: "Shoping Cart",
    icon: <FaShoppingCart />,
    child: [
     
      {
        href: "/shopping-cart/new",
        title: "Cart",
        icon: <MdAddShoppingCart />,
      },
      {
        href: "/shopping-cart/placed",
        title: "Placed Cart",
        icon: <MdOutlineShoppingCart />,
      },
      {
        href: "/shopping-cart/removed",
        title: "Removed Cart",
        icon: <MdRemoveShoppingCart/>,
      },
      
    ],
  },
 
  {
    title: "Retailer Report",
    icon: <FaFileAlt />,
    child: [
      {
        href: "/retailer-report/input-sale-details",
        title: "Input Sale Details",
        icon: <FaRupeeSign />,
      },
      {
        href: "/retailer-report/cancelled-orders",
        title: "Cancelled Orders",
        icon: <FaFileAlt />,
      },
      {
        href: "/retailer-report/data-sku-unit",
        title: "Data SKU Unit",
        icon: <FaClipboardCheck />,
      },
      {
        href: "/retailer-report/data-sku-pricing",
        title: "Data SKU Pricing",
        icon: <FaShippingFast />,
      },
      {
        href: "/retailer-report/margin-report",
        title: "Margin Report",
        icon: <MdMargin />,
      },
      {
        href: "/retailer-report/taxation-report",
        title: "Taxation Report",
        icon: <BsPercent />,
      },
      {
        href: "/retailer-report/packaging-material",
        title: "Issued Packaging Material",
        icon: <MdOutlineCardGiftcard />,
      },
    ],
  },
  // {
  //   title: "Report",
  //   icon: <TbReportAnalytics />,
  //   child: [
  //     {
  //       href: "/reports/amount-collection-report",
  //       title: "Amount collection report",
  //       icon: <TbCurrencyRupee />,
  //     },
  //     {
  //       href: "/reports/invoice-wise-delivery-status",
  //       title: "Invoice wise delivery status",
  //       icon: <MdSave />,
  //     },
  //     {
  //       href: "/reports/ds-margin-claims",
  //       title: "DS margin claims",
  //       icon: <BsFileEarmarkCheckFill />,
  //     },
  //     {
  //       href: "/reports/order-fulfillment",
  //       title: "Order fulfillment",
  //       icon: <TbTruckDelivery />,
  //     },
  //     {
  //       href: "/reports/sale",
  //       title: "Sale",
  //       icon: <BsGraphUp />,
  //     },
  //   ],
  // },
  {
    title: "Orders",
    icon: <BsJournalBookmark />,
    child: [
      {
        title: "All Orders",
        href: "/orders/all-orders",
        icon: <FaBorderAll />,
      },
      {
        title: "All Updated Orders",
        href: "/orders/updated-orders",
        icon: < MdUpdate/>,
      },
      {
        title: "New",
        href: "/orders/new-orders",
        icon: <VscNewFile />,
      },
      
      {
        title: "Accepted",
        href: "/orders/orders-accepted",
        icon: <TiTicket />,
      },
      {
        title: "Waiting For Agent",
        href: "/orders/waiting-order",
        icon: <MdOutlinePending />,
      },
      {
        title: "In-Process",
        href: "/orders/orders-in-progress",
        icon: <FcProcess />,
      },
      {
        title: "Out For Delivery",
        href: "/orders/orders-out-for-delivery",
        icon: <TbTruckDelivery />,
      },
      {
        title: "Delivered",
        href: "/orders/orders-delivered",
        icon: <GiStorkDelivery />,
      },
      {
        title: "Return",
        href: "/orders/orders-return",
        icon: <BsBookmarkCheckFill />,
      },
      {
        title: "Cancelled",
        href: "/orders/orders-cancelled",
        icon: <MdFreeCancellation />,
      },
      {
        title: "Failed",
        href: "/orders/orders-failed",
        icon: <MdOutlineDoNotDisturb />,
      },
    ],
  },
  {
    title: "Logs",
    icon: < FaAlignCenter/>,
    child: [
      {
        title: "Order Log",
        href: "/log/order",
        icon: <VscReferences  />,
      },
      {
        title: "Notification Log",
        href: "/log/notification",
        icon: < AiTwotoneNotification/>,
      },
     
    ],
  },
  {
    title:"Report",
    icon:< VscReport/>,
    child:[
      {
        title: "Advisory Pacakge",
        href:"/report/package",
        icon: <GiDiscussion/>,
      },
      {
        title: "Advisory Invoice",
        href:"/report/invoice",
        icon: < FaFileInvoice/>,
      },
      {
        title: "Delivery GST Report",
        href:"/report/delivery",
        icon: <MdDeliveryDining />,
      },
      {
        title: "GST Report",
        href:"/report/gst-report",
        icon:<TbCurrencyRupee />,
      },
    ]
  }
];

export default sideBarMainList;
