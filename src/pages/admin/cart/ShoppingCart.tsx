import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import CartListNew from "../../../components/admin/cart/cart-list";
import {
  addSno,
  dateTimeFormatTable,
  queryToStr,
  removeEsc,
} from "../../../components/admin/utils";
import { MainContainer } from "../../../components/layout";
import { cartFields } from "../../../constants/fields/master-fields";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { shopCart } from "../../../http/server-api/server-apis";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import CartToolbar from "../../../components/admin/cart/CartToolbar";

export default function ShoppingCart(props: { deleted: string }) {
  const { deleted } = props;
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const [searchText, setSearchText] = React.useState("");
  // const [cartTab, setCartTab] = React.useState(0);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();
  const searchHandler = (
    value: string,
    customer_id?: number,
    retailer_id?: number,
    sku_id?: number
  ) => {
    if (
      value == "" &&
      customer_id == undefined &&
      retailer_id == undefined &&
      sku_id == undefined
    )
      setSearchText("");
    else
      setSearchText(
        "/search/?" +
          queryToStr({
            customer_id: typeof customer_id !== "undefined" ? customer_id : 0,
            retailer_id: typeof retailer_id !== "undefined" ? retailer_id : 0,
            sku_id: typeof sku_id !== "undefined" ? sku_id : 0,
            ...(value ? { search_cart: value } : {}),
          })
      );
  };
  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopCart("get", {
        params: searchText
          ? searchText + `&deleted=${deleted}`
          : `?deleted=${deleted}`,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
        // indexing
        csvData = addSno(csvData);

        // remove esc
        csvData = removeEsc(csvData);

        // format date & time
        csvData = dateTimeFormatTable(csvData, "doc", "time");

        setCsvData(csvData, () => {
          ref.current.link.click();
          dispatch(setPageLoading(false));
        });
      }
    } catch (error) {
      console.log(error);
      dispatch(setPageLoading(false));
    }
  };

  function getCartTitle(): string {
    if (deleted == "1") return "Removed Cart";
    if (deleted == "2") return "Placed Cart";
    return "Shopping Cart";
  }

  useEffect(()=>{
    setSearchText("")
  },[deleted])


  return (
    <>
      <Box>
        <MainContainer>
          <CartToolbar
            title={getCartTitle()}
            onSearch={searchHandler}
            exportProps={{
              ref,
              data: csvData,
              headers: cartFields,
              filename: `${getCartTitle()} List.csv`,
              onClick: exportHandle,
            }}
            deleted={deleted}
          />
          <Box sx={{ mt: 3 }}>
            <CartListNew searchText={searchText} deleted={deleted} />
          </Box>
        </MainContainer>
      </Box>
    </>
  );
}
