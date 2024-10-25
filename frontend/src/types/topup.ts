export type TopupToken = {
  topup_id: string;
};

export type TopupDetails = {
  token_id: string;
  student_uid: string;
  student_name: string;
};

export type TopupHistoryDetails = {
  lucky_draw_code: string;
  amount: string;
  completed_timestamp: Date;
};
