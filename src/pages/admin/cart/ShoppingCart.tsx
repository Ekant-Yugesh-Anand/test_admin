import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import CartList from "../../../components/admin/cart/CartList";
import CartTypeTab from "../../../components/admin/cart/CartTypeTab";
import CommonToolbar from "../../../components/admin/common-toolbar";
import { addSno, removeEsc } from "../../../components/admin/utils";
import { MainContainer } from "../../../components/layout";
import { packageFields, productFields } from "../../../constants";
import { customerFields } from "../../../constants/fields/master-fields";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { shopPackages } from "../../../http";
import { shopCart } from "../../../http/server-api/server-apis";
import { setPageLoading } from "../../../redux/slices/admin-slice";

export default function ShoppingCart(props: { deleted: string }) {
  const { deleted } = props;
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const [searchText, setSearchText] = React.useState("");
  const [cartTab, setCartTab] = React.useState(0);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const searchHandler = async (value: string) => {
    setSearchText(value ? `/search?search_cart=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopCart("get", {
        postfix: `?type=${
          cartTab == 0 ? "customers" : "products"
        }&deleted=${deleted}`,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
        // indexing
        csvData = addSno(csvData);

        // remove esc
        csvData = removeEsc(csvData);

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

  useEffect(() => {
    setCartTab(0);
  }, [deleted]);

  return (
    <>
      <CartTypeTab onChange={setCartTab} value={cartTab} />
      <MainContainer>
        <CommonToolbar
          title={getCartTitle()}
          onSearch={searchHandler}
          exportProps={{
            ref,
            data: csvData,
            headers: cartTab == 0 ? customerFields : productFields,
            filename: cartTab == 0 ? `cart-list-customer` : `cart-list-farmer`,
            onClick: exportHandle,
          }}
        />
        <Card sx={{ mt: 1 }}>
          <CardContent sx={{ minHeight: 180 }}>
            <CartList
              searchText={searchText}
              type={cartTab == 0 ? "customers" : "products"}
              deleted={deleted}
            />
          </CardContent>
        </Card>
      </MainContainer>
    </>
  );
}
