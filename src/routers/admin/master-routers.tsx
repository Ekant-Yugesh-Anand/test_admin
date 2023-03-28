import Packages from "../../pages/admin/master/packages";
import Units from "../../pages/admin/master/units";
import { Areas, PrimaryAreas } from "../../pages/admin/master/area";
import Banner from "../../pages/admin/master/banner";
import Reason from "../../pages/admin/master/reason";
import AreaCsvImport from "../../pages/admin/master/area/AreaCsvImport";
import CouponBatch from "../../pages/admin/master/Coupon/CouponBatch";
import Languages from "../../pages/admin/master/Language";
import Notification from "../../pages/admin/master/notification";
import Coupon from "../../pages/admin/master/Coupon/Coupon";
import CouponLanguage from "../../pages/admin/master/Coupon/CouponLanguage";

export default {
  path: "/masters",
  children: [
    {
      path: "packages",
      element: <Packages />,
    },
    {
      path: "units",
      element: <Units />,
    },
    {
      path: "languages",
      element: <Languages />,
    },
    {
      path: "areas",
      children: [
        {
          path: "",
          element: <Areas />,
        },
        {
          path: ":area_id/primary-areas",
          element: <PrimaryAreas />,
        },
        {
          path: "area-csv-import",
          children: [
            {
              path: "",
              element: <AreaCsvImport />,
            },
          ],
        },
      ],
    },
    {
      path: "banner",
      element: <Banner />,
    },
    {
      path: "reason",
      element: <Reason />,
    },
    {
      path: "coupon",
      // element: <CouponBatch />,
      children:[
        {
          path: "",
          element: <CouponBatch />,
        },
        {
          path: ":batch_name/language",
          element: <CouponLanguage />,
        },
        {
          path: ":batch_name",
          element: <Coupon />,
        },
      ]
    },
    {
      path: "notification",
      element: < Notification/>,
    },
  ],
};
