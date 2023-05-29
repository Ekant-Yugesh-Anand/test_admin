import * as React from "react";
import { Tab, Tabs, Box } from "@mui/material";
import PageBack from "../layout/page-back";


const LanguageTab = (props: {
  lang: string;
  ChangeLang: (arg: string) => unknown;
  languages: any;
}) => {
  const { lang, ChangeLang, languages } = props;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    ChangeLang(newValue);
  };

  return (
    <Box className="grid grid-cols-12 ">
      {languages && (
        <Box className="col-span-10" sx={{ width: "100%", padding: 1 }}>
          <Tabs
            value={lang}
            onChange={handleChange}
            centered
            textColor="secondary"
            indicatorColor="secondary"
          >
            {languages.map((lang: any) => {
              return (
                <Tab
                  label={lang?.language_native}
                  value={lang}
                  key={lang?.language_id}
                />
              );
            })}
          </Tabs>
        </Box>
      )}
      <PageBack />
    </Box>
  );
};
export default LanguageTab;
