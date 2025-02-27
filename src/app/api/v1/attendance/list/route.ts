import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query to find today's attendance for the given user
    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: todayAttendance,
      status: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error retrieving user.",
      status: false,
      error: error,
    });
  }
}
