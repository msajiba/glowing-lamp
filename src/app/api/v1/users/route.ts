import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      data: users,
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
