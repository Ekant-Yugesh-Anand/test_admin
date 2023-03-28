import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { makeStyles, styled } from '@mui/material';


export default function Dashboard_Toolbar() {
    const CustomInput = styled(TextField)(() => ({
        "& .MuiInputBase-input": {
            border: "none",
            "&:focus": {
                boxShadow: "none",
            },
        },
    }));

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            margin: 2
        }}>
            <Autocomplete
                disablePortal
                id="report"
                options={report_type}
                sx={{ width: 300, }}
                renderInput={(params) => <CustomInput sx={{
                    outline: "none"
                }}{...params} label="Report-Category" />}
            />
        </Box>

    );
}

const report_type = [
    { label: 'Today', value: "today" },
    { label: 'This Week', year: "week" },
    { label: 'This Month', year: "month" },
    { label: 'This Year', year: "year" },

];
