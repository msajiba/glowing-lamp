import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = Number((await params).userId);

  if (isNaN(userId)) {
    return NextResponse.json({
      message: "Invalid user ID.",
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

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query to find today's attendance for the given user
    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    return NextResponse.json({
      data: todayAttendance,
      status: true,
      user: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error retrieving user.",
      status: false,
      error: error,
    });
  }
}
