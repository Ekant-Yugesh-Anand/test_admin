import { Box, FormHelperText, InputBaseProps, styled } from "@mui/material";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";
const Label = styled("label")(() => ({
  display: "block",
  color: "#6b7280",
  fontWeight: 600,
}));

interface IProps extends InputBaseProps {
  label?: string;
  value: string;
  helperText?: string;
  actualValue?: string;
  onChangeOption: (value: any, values?: Record<string, any>) => void;
}

export default function WebInput(props: IProps) {
  const {
    label,
    error,
    helperText,
    value,
    onChangeOption,
    actualValue,
    ...inputProps
  } = props;

  const idStr = React.useMemo(() => {
    const random = Math.random().toString(36).substring(7);
    return `${props.type}-${random}`;
  }, []);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [loadFirst, setLoadFirst] = useState(false);
  const updateState = useCallback(
    (actualValue: string) => {
      const blocksFromHTML = convertFromHTML(actualValue);
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          )
        )
      );
    },
    [value]
  );

  React.useEffect(() => {
    if (value && !loadFirst) {
      if (value == "" || value != "<p></p>") {
        setLoadFirst(true);
        updateState(value);
      } else {
        setTimeout(() => {
          return setLoadFirst(true);
        }, 2000);
      }
    }
  }, [value, loadFirst]);

  React.useEffect(() => {
    actualValue && updateState(actualValue);
  }, [actualValue]);

  React.useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    onChangeOption(html);
  }, [editorState]);

  return (
    <Box sx={{ my: 1, width: "100%" }}>
      <Label htmlFor={idStr}>{label}</Label>
      <Box
        sx={{
          padding: 1,
          border: "1px solid #ced4da",
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          editorStyle={{ height: 300 }}
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontFamily",
              "fontSize",
              "list",
              "textAlign",
              "link",
              "colorPicker",
            ],
            list: {
              options: ["unordered", "ordered"],
            },
            colorPicker: {
              inDropdown: true,
            },
            link: {
              inDropdown: true,
            },
          }}
        />
      </Box>

      <FormHelperText error={error}>{helperText}</FormHelperText>
    </Box>
  );
}
