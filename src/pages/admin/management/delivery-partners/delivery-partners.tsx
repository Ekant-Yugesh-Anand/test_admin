import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import DeliveryPartnerList from "../../../../components/admin/delivery-partner/delivery-partner-list";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { deliveryPartners } from "../../../../http";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import { deliveryPartnerFields } from "../../../../constants";

export default function DeliveryPartner() {
  const [searchText, setSearchText] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_partner=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await deliveryPartners("get", {
        postfix: searchText,
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

  return (
    <MainContainer>
      <CommonToolbar
        title="Delivery Partners"
        onSearch={searchHandler}
        onAddProps={{
          title: "Add Delivery Partner",
          onClick() {
            navigate("new");
          },
        }}
        exportProps={{
          ref,
          data: csvData,
          filename: `delivery-partner-csv`,
          onClick: exportHandle,
          headers: deliveryPartnerFields,
        }}
      />
      <Box sx={{ mt: 2 }}>
        <DeliveryPartnerList searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
