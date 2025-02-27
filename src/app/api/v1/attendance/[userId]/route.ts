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
      });
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      data: attendance,
      user: userExists,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Error retrieving user.",
      error: error,
    });
  }
}
