export type Employee = {
  id: string;
  photo_url?: string | null;
  name: string;
  email: string;
  phone: string;
  password: string;
  position: string;
  role: "employee" | "admin" | "manager";
  salary: number;
  address: string;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
};
