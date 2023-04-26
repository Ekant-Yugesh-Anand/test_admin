import * as Yup from "yup";
import { emptyText } from "../../../../constants/messages";

const moveOrdersSchemas = {
  "0": Yup.object({}),
  "1": Yup.object({
    partner_id: Yup.number().required(emptyText("partner")),
  }),
  "2":Yup.object({
    reschedule_reason: Yup.string().required(emptyText("reshedule reason"))
  }),

  "3": Yup.object({
    agent_id: Yup.number().required(emptyText("agent_id")),
  }),
  "4": Yup.object({
    agent_id: Yup.number().required(emptyText("agent")),
  }),
  "5": {
    cash: Yup.object({
      amount_receive: Yup.string().required(emptyText("amount receive")),
      payment_to: Yup.string().required(emptyText("payment to")),
    }),
    upi: Yup.object({
      name: Yup.string().required(emptyText("name")),
      payment_to: Yup.string().required(emptyText("payment to")),
      amount: Yup.string().required(emptyText("amount")),
      upi_amount: Yup.string().required(emptyText("upi amount")),
      cash_amount: Yup.string().required(emptyText("cash amount")),
    }),
  },
  "6": Yup.object({}),
  "7": Yup.object({
    reason_id: Yup.number().required(emptyText("reason")),
    other_reason: Yup.string().min(2).required(emptyText("other reason")),
  }),
  "8": Yup.object({
    return_partner_id: Yup.number().required(emptyText("partner")),
  }),
  "9": Yup.object({
    reason_id: Yup.number().required(emptyText("reason")),
    other_reason: Yup.string().min(2).required(emptyText("other reason")),
  }),
  "10": Yup.object({
    reason_id: Yup.number().required(emptyText("reason")),
    other_reason: Yup.string().min(2).required(emptyText("other reason")),
  }),
  "12": Yup.object({
    return_partner_id: Yup.number().required(emptyText("partner")),
    agent_id: Yup.number(),
  }),
  "18": Yup.object({
    refund_amount: Yup.string().required(emptyText("refund amount")),
  }),
};

export default moveOrdersSchemas;
