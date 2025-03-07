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

export type UsersListType = {
  data: {
    id: number;
    name: string;
    email: string;
  }[];
};

export type AttendanceListType = {
  data: {
    id: string;
    date: Date;
    clockIn: Date;
    clockOut: Date;
    clockInDesc: string | null;
    clockOutDesc: string | null;
    userId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }[];
};
