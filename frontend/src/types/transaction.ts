export type TransactionToken = {
  transaction_id: string;
};

export type TransactionDetails = {
  transaction_id: string;
  status: string;
  amount: string;
  start_timestamp: Date;
  name: string;
};
