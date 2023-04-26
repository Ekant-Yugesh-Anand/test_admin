import React from "react";
import { useSnackbar } from "notistack";
import { Box, Button, CircularProgress } from "@mui/material";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import SerialNumber from "../../../../components/admin/serial-number";
import { MainContainer } from "../../../../components/layout";
import CSVFileReader from "../../../../components/csv/csv-file-reader";
import PreviewTable from "../../../../components/table/preview-table";
import CheckDataCell from "../../../../components/table/cell/CheckDataCell";
import { brands, shopAreas } from "../../../../http";
import { useNavigate } from "react-router-dom";
import { dtypeValidation } from "../../../../components/admin/utils";
import BrandTemplate from "../../../../csv-json-template/brand.json";

export default function BrandCsvImport() {
    const ref = React.useRef<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState<Array<Record<string, any>>>([]);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const validateList =
        React.useMemo<
            Array<{
                label: string;
                dtype: "string" | "number";
            }>>(
                () => [
                    { label: "brand_name", dtype: "string" },
                    { label: "brand_image", dtype: "string" },
                    // { label: "description", dtype: "string" },
                    // { label: "seq_no", dtype: "number" },
            

                ],
                []
            );

    const columns = React.useMemo(
        () => [
            {
                Header: "S No.",
                accessor: (_row: any, i: number) => i + 1,
                Cell: (cell: any) => <SerialNumber cell={cell} page={0} size={"1"} />,
                width: "5.5%",
            },
            {
                Header: "Brand Name",
                accessor: "brand_name",
                Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
            },
            {
                Header: "Brand Image",
                accessor: "brand_image",
                Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
            },
            // {
            //     Header: "Description",
            //     accessor: "description",
            //     Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
            // },
            // {
            //     Header: "Sequence No",
            //     accessor: "seq_no",
            //     Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
            // }
           

        ],
        []
    );

    const exportHandle = () => ref.current.link.click();
    const onRead = (data: Array<Record<string, any>>) => setData(data);

    const updateMyData = (rowIndex: number, columnId: string, value: any) => {
        setData((old) =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            })
        );
    };

    const onUpload = async () => {
        let show = false;
        for (let index = 0; index < data.length; index++) {
            const row = data[index];
            for (const column of validateList) {
                const { error } = dtypeValidation(
                    row[column.label],
                    column.dtype
                );
                show = error;
            }
            if (show) {
                enqueueSnackbar(`please check S No. ${index + 1}`, {
                    variant: "error",
                });
                break;
            }
        }
        if (!show) {
            try {
                setLoading(true);
                for (let index = 0; index < data.length; index++) {
                    const row = data[index];

                    try {
                        await brands("post", {
                            data: JSON.stringify({
                                brand_name:row.brand_name,
                                brand_image:row.brand_image
                            }),
                        });
                    } catch (err: any) {
                        console.log(err);
                    }
                }
                navigate(-1);
                enqueueSnackbar(`Brand csv upload successfully.`, {
                    variant: "success",
                });
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false);
    };

    return (
        <MainContainer>
            <CommonToolbar
                title="Import CSV Brand"
                exportProps={{
                    ref,
                    data: BrandTemplate,
                    title: "Export Template",
                    filename: "brand-template-csv",
                    onClick: exportHandle,
                }}
            />
            <Box my={1}>
                <CSVFileReader setFile={onRead} />
            </Box>
            <Box sx={{ mt: 1 }}>
                <PreviewTable
                    columns={columns}
                    data={data || []}
                    showNotFound={data.length === 0}
                    updateMyData={updateMyData}
                />
            </Box>
            <Button
                sx={{ mt: 2 }}
                color="secondary"
                size="small"
                variant="contained"
                onClick={onUpload}
                disabled={data.length > 0 ? loading : true}
                startIcon={
                    loading ? <CircularProgress color="inherit" size={18} /> : undefined
                }
            >
                Upload
            </Button>
        </MainContainer>
    );
}
