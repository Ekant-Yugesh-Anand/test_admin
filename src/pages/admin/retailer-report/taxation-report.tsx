import TaxationReportTable from "../orders/taxation-report-table";
export default function TaxationReport() {
  return (
    <TaxationReportTable
        orderStatus="5"
        title="Taxation Report"
        filename="taxation-report"
    />
  );
}
