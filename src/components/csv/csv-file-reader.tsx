import React from "react";
import CSVReader, { IFileInfo } from "react-csv-reader";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { MdDelete } from "react-icons/md";
import { useSnackbar } from "notistack";

export default function CSVFileReader(props: {
  setFile: (data: Array<Record<string, any>>) => void;
}) {
  const { setFile } = props;
  const [ref, setRef] = React.useState<HTMLInputElement | null>(null);
  const [removeShow, setRemoveShow] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onRemove = () => {
    if (ref) {
      ref.value = "";
      ref.files = null;
      setFile([]);
      setRemoveShow(false);
    }
  };

  const fileLoadHandler = (
    data: any[],
    fileInfo: IFileInfo,
    originalFile?: File | undefined
  ) => {
    // if (data.length <= 100) {
      setFile(data);
      setRemoveShow(true);
    // } else {
    //   if (ref) {
    //     ref.value = "";
    //     ref.files = null;
    //   }
    //   enqueueSnackbar("only 100 entry upload at a time!", { variant: "error" });
    // }
  };

  const onError = (error: Error) => {
    enqueueSnackbar("only csv file type support!", { variant: "error" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        input: {
          borderRadius: 1,
        },
        "input[type=file]::file-selector-button": {
          backgroundColor: "secondary.main",
          borderRadius: 1,
        },
      }}
    >
      <CSVReader
        inputRef={(r) => setRef(r)}
        onFileLoaded={fileLoadHandler}
        parserOptions={{
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }}
        strict
        onError={onError}
      />
      {removeShow && (
        <IconButton onClick={onRemove}>
          <MdDelete />
        </IconButton>
      )}
    </Box>
  );
}
