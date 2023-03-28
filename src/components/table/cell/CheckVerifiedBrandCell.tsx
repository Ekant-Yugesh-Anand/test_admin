import React from "react";
import { Typography } from "@mui/material";
import { Cell } from "react-table";
import { dtypeValidation } from "../../admin/utils";
import { useQuery } from "@tanstack/react-query";
import { brands, } from "../../../http";

export default function CheckVerifiedBrandCell(props: {
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
            return brands("get", {
                params: `check?brand=${cell.value}`,
            })
        })
        return (
            <>
                {!error && (data?.data?.active == "1" ? <Typography fontSize="small" > {cell.value} </Typography> : <Typography fontSize="small" color="error" >Invalid Brand</Typography>)
                }
            </>
        );
    }
    return <Typography fontSize="small">Invalid Brand</Typography>;
}
