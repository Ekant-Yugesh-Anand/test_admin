import * as React from "react";
import { Tab, Tabs, Box } from "@mui/material";


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
    <Box className="lg:col-span-2">
      {languages && (
        <Box sx={{ width: "100%", padding: 1 }}>
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
    </Box>
  );
};
export default LanguageTab;
