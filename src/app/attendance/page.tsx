import Navbar from "@/components/common/navbar";
import AttendanceList from "@/components/pages/attendance";
import { UserAttendanceList } from "@/components/pages/home/types";
import { cookies } from "next/headers";
import React from "react";

const fetchAttendanceData = async () => {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return null;
    }

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

export const dynamic = "force-dynamic";

const attendancePage = async () => {
  const attendanceData = await fetchAttendanceData();

  return (
    <div>
      <Navbar />
      <AttendanceList attendanceData={attendanceData as UserAttendanceList} />
    </div>
  );
};

export default attendancePage;
