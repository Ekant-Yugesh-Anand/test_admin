import React from "react";
import { Typography } from "@mui/material";
import { Cell } from "react-table";
import { dtypeValidation } from "../../admin/utils";
import { useQuery } from "@tanstack/react-query";
import { shopPackages, } from "../../../http";


export default function CheckVerifiedPackageCell(props: {
    cell: Cell;
    dtype: "string" | "number";
}) {
    const {
        cell,
        dtype,
    } = props;

    const { error, message } = React.useMemo(
        () => dtypeValidation(cell.value, dtype),
        [cell.value, dtype]
    );



    if (error) {
        return (
            <Typography fontSize="small" color="error">
                {message}
            </Typography>
        );
    }
    if (!error) {
        const { data, isLoading, error } = useQuery([`brand-check${cell.value}`], () => {
            return shopPackages("get", {
                params: `check?package=${cell.value}`,
            })
        })
        return (
            <>
                {!error && (data?.data?.active == "1" ? <Typography fontSize="small" > {cell.value} </Typography> : <Typography fontSize="small" color="error" >Invalid Package</Typography>)
                }
            </>


        );
    }
    return <Typography fontSize="small">Invalid Pakage</Typography>;
}
