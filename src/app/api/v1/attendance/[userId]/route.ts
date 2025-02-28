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

    const attendance = await prisma.attendance.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      data: attendance,
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
