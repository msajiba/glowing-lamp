import React from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { fetchUserData } from "@/fetcher";

const AttendanceSystem = dynamic(() => import("./attendance-system"), {
  loading: () => <p>Loading...</p>,
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
        <p>Error loading attendance data.</p>
      )}
    </div>
  );
};

export default HomeIndex;
