import React from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { UserAttendance } from "./types";

// Dynamically import AttendanceSystem
const AttendanceSystem = dynamic(() => import("./attendance-system"), {
  loading: () => <p>Loading...</p>, // Optional loading state
});

const fetchData = async (): Promise<UserAttendance | null> => {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return null;
    }

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

const HomeIndex = async () => {
  const userAttendance = await fetchData();

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
