import AttendanceList from "@/components/pages/attendance";
import { UserAttendanceList } from "@/components/pages/home/types";
import { fetchAttendanceData } from "@/fetcher";
import { cookies } from "next/headers";
import React from "react";

export const dynamic = "force-dynamic";

const attendancePage = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    console.error("User ID not found in cookies");
    return null;
  }

  const attendanceData = await fetchAttendanceData(userId);

  return (
    <div>
      <AttendanceList attendanceData={attendanceData as UserAttendanceList} />
    </div>
  );
};

export default attendancePage;
