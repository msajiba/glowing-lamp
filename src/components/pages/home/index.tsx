import React from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { fetchUserData } from "@/fetcher";
import AttendanceSystemSkeleton from "./attendance-system-skeleton";

const AttendanceSystem = dynamic(() => import("./attendance-system"), {
  loading: () => <AttendanceSystemSkeleton />,
});

const HomeIndex = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    console.error("User ID not found in cookies");
    return null;
  }

  const userAttendance = await fetchUserData(userId);

  return (
    <div>
      {userAttendance ? (
        <AttendanceSystem userAttendance={userAttendance} />
      ) : (
        <AttendanceSystemSkeleton />
      )}
    </div>
  );
};

export default HomeIndex;
