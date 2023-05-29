import React from "react";
import { useSnackbar } from "notistack";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { RiDeleteBinFill } from "react-icons/ri";
import { Box, Tooltip, IconButton } from "@mui/material";
import { queryToStr } from "../utils";
import SerialNumber from "../serial-number";
import DataTable from "../../table/data-table";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import LanguageFormDialog from "./form-dialog/Language-form-dialog";
import { shopLanguages } from "../../../http/server-api/server-apis";

export default function LanguageList(props: {
    searchText: string;
    addOpen: boolean;
    addClose: () => void;
}) {
    const { page, setPage, size, setSize } = usePaginate();
    const [deleteData, setDeleteData] = React.useState({
        id: "",
        open: false,
    });

    const [edit, setEdit] = React.useState<{
        value: { [key: string]: any } | null;
        open: boolean;
    }>({
        value: {},
        open: false,
    });

    const { searchText, addClose, addOpen } = props;

    const postfix = React.useMemo(() => {
        const x = queryToStr({
            page,
            size,
        });
        return searchText ? `${searchText}&${x}` : `?${x}`;
    }, [searchText, page, size]);

    const { enqueueSnackbar } = useSnackbar();

    const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

    const { isLoading, refetch, data } = useQuery(
        ["languages", postfix],
        () =>
            shopLanguages("get", {
                postfix,
      
            }),
        {
            refetchOnWindowFocus: false,
        }
    );



    const onDelete = async () => {
        try {
            const res: any = await shopLanguages("delete", {
                params: deleteData?.id,
            });
            if (res.status === 200) {
                await refetch();
                setTimeout(
                    () =>
                    enqueueSnackbar("entry successfully deleted ", {
                      variant: "success",
                    }),
                    2000
                  );
            }
        } catch (err: any) {
            console.log(err);
            setTimeout(
                () =>
                enqueueSnackbar("entry could not delete ", { variant: "error" }),
                2000
              );
        }
        deleteBoxClose();
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "S No.",
                accessor: (_row: any, i: number) => i + 1,
                Cell: (cell: any) => (
                    <SerialNumber cell={cell} page={page} size={size} />
                ),
                width: "5.5%",
            },
            {
                Header: "Status",
                accessor: "active",
                width: "10%",
                Cell: (cell: any) => (
                    <ActiveDeactive
                        cell={cell}
                        idAccessor="language_id"
                        refetch={refetch}
                        payload={["language"]}
                        axiosFunction={shopLanguages}
                    />
                ),
            },
            {
                Header: "Language code",
                accessor: "lang_code",
            },
            {
                Header: "Native",
                accessor: "language_native",
            },
            {
                Header: "Language",
                accessor: "language",
            },
            {
                Header: "Action",
                width: "15%",
                Cell: (cell: any) => (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="Edit">
                            <IconButton
                                disableRipple={false}
                                size="small"
                                color="secondary"
                                onClick={() =>
                                    setEdit({
                                        open: true,
                                        value: cell.row.original,
                                    })
                                }
                            >
                                <FaRegEdit />
                            </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Delete">
                            <IconButton
                                disableRipple={false}
                                size="small"
                                color="secondary"
                                onClick={() =>
                                    setDeleteData({
                                        open: true,
                                        id: cell.row.original.language_id,
                                    })
                                }
                            >
                                <RiDeleteBinFill />
                            </IconButton>
                        </Tooltip> */}
                    </Box>
                ),
            },
        ],
        [page, size]
    );

    const getData = React.useMemo(() => {
        if (data?.status === 200) return data.data;
        return { totalItems: 0, totalPages: 1, units: [] };
    }, [data]);

    React.useEffect(() => {
        if (searchText) setPage(0);
    }, [searchText]);


    return (
        <>
            {!isLoading && <DataTable
                loading={isLoading}
                columns={columns}
                data={getData?.languages || []}
                showNotFound={getData.totalItems === 0}
                components={{
                    pagination: (
                        <TablePagination
                            page={page}
                            pageSize={size}
                            totalItems={getData.totalItems}
                            count={getData.totalPages}
                            onChangePage={setPage}
                            onPageSizeSelect={setSize}
                        />
                    ),
                }}
            />}
            <DeleteDialogBox
                open={deleteData?.open}
                onClickClose={deleteBoxClose}
                onClickOk={onDelete}
            />
            {edit && (
                <LanguageFormDialog
                    open={edit.open}
                    close={() => setEdit({ open: false, value: null })}
                    unit={edit.value}
                    reload={refetch}
                    variant="edit"
                />
            )}
            {addOpen && (
                <LanguageFormDialog
                    open={addOpen}
                    close={addClose}
                    unit={null}
                    reload={refetch}
                    variant="save"
                />
            )}
        </>
    );
}
