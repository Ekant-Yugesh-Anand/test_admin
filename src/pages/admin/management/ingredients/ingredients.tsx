import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { addSno, removeEsc } from "../../../../components/admin/utils";
import {useNavigate} from "react-router-dom"
import IngredientsListResult from "../../../../components/admin/ingredients/ingredients-list-result";
import { shopIngredients } from "../../../../http/server-api/server-apis";
import { ingredientsField } from "../../../../constants/fields/ingredients-fields";

export default function Ingredients() {
  const navigate= useNavigate()
  const [searchText, setSearchText] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);


  const searchHandler = (value: string) => {
    setSearchText(value ? `/search?search_ingredient=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopIngredients("get", {
        params: "ingredients",
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
        onAddProps={{
          title: "Add Ingredients",
          onClick: onAdd,
        }}
        title="Ingredients"
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `ingredients-csv`,
          onClick: exportHandle,
          headers: ingredientsField,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <IngredientsListResult
          searchText={searchText}
          addOpen={open}
          addClose={onClose}
          
        />
      </Box>
    </MainContainer>
  );
}
