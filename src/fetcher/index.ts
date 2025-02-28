import {
  AttendanceListType,
  UserAttendance,
  UserAttendanceList,
  UsersListType,
} from "@/components/pages/home/types";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 10,
      },
    });
    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Error fetching data:", data);
      return {
        data: [],
      };
    }

    return data as UsersListType;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      data: [],
    };
  }
};

export const fetchAttendanceData = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/attendance/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );
    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Error fetching data:", data);
      return null;
    }

    return data as UserAttendanceList;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchUserData = async (
  userId: string
): Promise<UserAttendance | null> => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/attendance/${userId}/current-day`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );
    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Error fetching data:", data);
      return null;
    }

    return data as UserAttendance;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchTodayAttendanceList = async () => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/attendance/list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 10,
        },
      }
    );
    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Error fetching data:", data);
      return {
        data: [],
      };
    }

    return data as AttendanceListType;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      data: [],
    };
  }
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const user = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      role: true,
      email: true,
      name: true,
    },
  });
  return user;
};
