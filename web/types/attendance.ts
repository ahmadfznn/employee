export type Attendance = {
  id: string;
  employee: {
    name: string;
    email: string;
    position: string;
    department: string;
  };
  date: string;
  check_in: string;
  check_out: string;
  location_check_in: {
    latitude: string;
    longitude: string;
  };
  location_check_out: {
    latitude: string;
    longitude: string;
  };
  status: "present" | "absent" | "late" | "leave";
  created_at?: string;
  updated_at?: string;
};
