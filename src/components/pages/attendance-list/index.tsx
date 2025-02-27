import React from "react";
import { fetchTodayAttendanceList } from "@/fetcher";
import { AttendanceListType } from "../home/types";
import AttendanceList from "./attendance-list";

const AttendanceListIndex = async () => {
  const attendanceListData = await fetchTodayAttendanceList();

  return (
    <div>
      <AttendanceList
        attendanceListData={attendanceListData as AttendanceListType}
      />
    </div>
  );
};

export default AttendanceListIndex;
