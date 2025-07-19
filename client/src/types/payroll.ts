export type Payroll = {
  id: string;
  employee: {
    name: string;
    email: string;
    position: string;
  };
  month: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  total_salary: number;
  status: "pending" | "paid";
  payment_date: string;
  created_at?: string;
  updated_at?: string;
};
