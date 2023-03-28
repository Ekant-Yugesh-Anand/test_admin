import React from "react";
import { Typography } from "@mui/material";
import { Cell } from "react-table";
import { dtypeValidation } from "../../admin/utils";
import { useQuery } from "@tanstack/react-query";
import { categories, subCategories } from "../../../http";
import axios from "axios";
import { baseUrl } from "../../../http/config";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function CheckVerifiedSubCategoryCell(props: {
    cell: Cell;
    dtype: "string" | "number";
}) {
    const {
        cell,
        dtype,
    } = props;

    const [categoryId, setCategoryId] = React.useState("")
    const [subCategoryData, setSubCategoryData] = React.useState<any>("")

    const {
        acessTokenSlice: { auth }
    } = useSelector((state: RootState) => state);

    React.useEffect(() => {
        if (categoryId) {
            axios.get(`${baseUrl}/shop_subcategories/check?subcategory=${cell.value}&category_id=${categoryId}`, {
                headers: {
                    Authorization: auth.token
                }
            }).then(res => {
                setSubCategoryData(res.data)
            }).catch(err => {
                console.log(err)
            })
        }

    }, [categoryId, cell.value])
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
        const response = useQuery([`category-check${cell.row.values.category}`], () => {
            return categories("get", {
                params: `check?category=${cell.row.values.category}`,
            })
        })
        if (response.data?.data) {
            let category_id = response.data.data.category_id
            if (!categoryId) {
                setCategoryId(category_id)
            }

        }
    }

    if (categoryId) {
        return <>
            {subCategoryData?.active == "1" ? <Typography fontSize="small" > {cell.value} </Typography> : <Typography fontSize="small" color="error" >Invalid Subcategory</Typography>
            }
        </>
    }


    return <Typography fontSize="small" color="error">Invalid Subcategory</Typography>;
}
