import AttendanceList from "@/components/pages/attendance";
import { UserAttendanceList } from "@/components/pages/home/types";
import { notFound } from "next/navigation";

import React from "react";
import { users } from "../../../../../public/data";
import { fetchAttendanceData } from "@/fetcher";

type Params = Promise<{ userId: string }>;

const attendancePage = async (props: { params: Params }) => {
  const userId = (await props.params).userId;

  const checked = users.map((user) => user.id).includes(Number(userId));

  if (!checked) notFound();
  const attendanceData = await fetchAttendanceData(userId);

  return (
    <div>
      <AttendanceList attendanceData={attendanceData as UserAttendanceList} />
    </div>
  );
};

export default attendancePage;
