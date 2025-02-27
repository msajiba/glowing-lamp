export type UserAttendance = {
  data: {
    id: string;
    date: string;
    clockIn: string;
    clockOut: string;
    clockInDesc: string | null;
    clockOutDesc: string | null;
    userId: number;
  };
  status: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export type UserAttendanceList = {
  data: {
    id: string;
    date: string;
    clockIn: string;
    clockOut: string;
    clockInDesc: string | null;
    clockOutDesc: string | null;
    userId: number;
  }[];
  status: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
};
