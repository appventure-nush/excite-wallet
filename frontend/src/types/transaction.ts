export type TransactionToken = {
  transaction_id: string;
};

export type TransactionDetails = {
  transaction_id: string;
  status: string;
  amount: string;
  name: string;
};

export type TransactionHistoryDetails = {
  name: string;
  completed_timestamp: Date;
  amount: string;
};
