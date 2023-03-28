import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import DeliveryAgentList from "../../../../components/admin/delivery-partner/delivery-agent-list";
import { deliveryPartners, shopDeliveryAgent } from "../../../../http";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import { deliveryAgentFields } from "../../../../constants";

export default function DeliveryAgents() {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const { partner_id } = useParams();

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_agent=${value}` : "");
  };

  const { data } = useQuery(["delivery-agent-name"], () =>
    deliveryPartners("get", { params: partner_id })
  );

  const partnerName = React.useMemo(() => {
    if (data?.status) return data.data?.partner_name;
    return "";
  }, [data]);

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopDeliveryAgent("get", {
        postfix: searchText
          ? searchText.concat(`&partner_id=${partner_id}`)
          : `?partner_id=${partner_id}`,
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
        title={`${partnerName} / Delivery Agent`}
        onAddProps={{ title: "Add Delivery Agent", onClick: onAdd }}
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `delivery-agent-csv`,
          onClick: exportHandle,
          headers: deliveryAgentFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <DeliveryAgentList
          searchText={searchText}
          addClose={onClose}
          addOpen={open}
          partner_id={partner_id as string}
        />
      </Box>
    </MainContainer>
  );
}
