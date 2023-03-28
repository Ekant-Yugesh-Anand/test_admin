import Box from "@mui/material/Box";
import React from "react";
import { useDispatch } from "react-redux";
import CommonToolbar from "../../../components/admin/common-toolbar";
import PackagesList from "../../../components/admin/master/packages-list";
import { addSno, removeEsc } from "../../../components/admin/utils";
import { MainContainer } from "../../../components/layout";
import { packageFields } from "../../../constants";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { shopPackages } from "../../../http";
import { setPageLoading } from "../../../redux/slices/admin-slice";

export default function Packages() {
  const [open, setOpen] = React.useState(false);
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);


// categorydata export 
 
const exportHandle = async () => {
  try {
    dispatch(setPageLoading(true));
    const res = await shopPackages("get");
    if (res?.status === 200) {
      let csvData = res.data.packages || [];
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
        title="Packages"
        onAddProps={{ title: "Add Package", onClick: onAdd }}
        exportProps={{
          ref,
          data: csvData,
          filename: `packages-csv`,
          onClick: exportHandle,
          headers: packageFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <PackagesList searchText="" addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
