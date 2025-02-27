import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Post = {
  clockInDesc?: string;
  userId: number;
};

type Put = {
  id: string;
  clockOutDesc?: string;
};

export const GET = async () => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      data: attendance,
      status: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Error fetching attendance records.",
      error: error,
    });
  }
};

export const POST = async (req: NextRequest) => {
  const { clockInDesc, userId } = (await req.json()) as Post;

  if (!userId) {
    return NextResponse.json({
      message: "User ID is required.",
      status: false,
    });
  }

  try {
    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({
        message: "User does not exist.",
        status: false,
      });
    }

    // Get the start and end of the current day
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if there is already an attendance record for today
    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (todayAttendance) {
      return NextResponse.json({
        message: "Already clocked in today.",
        status: false,
        user: {
          id: userExists.id,
          name: userExists.name,
          email: userExists.email,
        },
        info: {
          clockOut: `PUT /api/v1/attendance`,
          clockOutBody: `{id: ${todayAttendance.id}, clockOutDesc: if any}`,
          clockInTime: todayAttendance.clockIn.toLocaleString(),
        },
      });
    }

    // Create a new attendance record
    const createAttendance = await prisma.attendance.create({
      data: {
        clockInDesc,
        userId,
      },
    });

    return NextResponse.json({
      message: "Clock-in successful!",
      status: true,
      data: createAttendance,
      user: {
        name: userExists.name,
        email: userExists.email,
      },
      info: {
        clockOut: `PUT /api/v1/attendance`,
        clockOutBody: `{id: ${createAttendance.id}, clockOutDesc: if any}`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Error clocking in.",
      status: false,
      error: error,
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  const { id, clockOutDesc } = (await req.json()) as Put;

  if (!id) {
    return NextResponse.json({
      message: "Attendance ID is required.",
      status: false,
    });
  }

  try {
    // Check if the attendance record exists
    const attendanceRecord = await prisma.attendance.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!attendanceRecord) {
      return NextResponse.json({
        message: "Attendance record does not exist.",
        status: false,
      });
    }

    // Check if clockOut is already updated
    if (attendanceRecord.clockOut) {
      return NextResponse.json({
        message: "Already clocked out.",
        status: false,
        user: {
          name: attendanceRecord.user.name,
          email: attendanceRecord.user.email,
        },
        info: {
          clockIn: `POST /api/v1/attendance`,
          clockInBody: `{clockInDesc: if any, userId: ${attendanceRecord.userId}}`,
          clockInTime: attendanceRecord.clockIn.toLocaleString(),
          clockOutTime: attendanceRecord.clockOut.toLocaleString(),
        },
      });
    }

    const updateAttendance = await prisma.attendance.update({
      where: {
        id,
      },
      data: {
        clockOutDesc,
        clockOut: new Date(),
      },
    });

    return NextResponse.json({
      message: "Clock-out successful!",
      status: true,
      data: updateAttendance,
      user: {
        name: attendanceRecord.user.name,
        email: attendanceRecord.user.email,
      },
      info: {
        clockIn: `POST /api/v1/attendance`,
        clockInBody: `{clockInDesc: if any, userId: ${attendanceRecord.userId}}`,
        clockInTime: attendanceRecord.clockIn.toLocaleString(),
        clockOutTime: updateAttendance.clockOut!.toLocaleString(),
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error clocking out.",
      status: false,
      error: error,
    });
  }
};
