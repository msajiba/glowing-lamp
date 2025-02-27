import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { serialize } from "cookie";
import prisma from "@/lib/prisma";
import { JWT_SECRET } from "@/utils/constants";
import jwt from "jsonwebtoken";

const MAX_AGE = 60 * 60 * 24 * 30;

export const POST = async (request: Request) => {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({
      message: "Please provide email and password",
      status: false,
    });
  }

  try {
    const existUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!existUser) {
      return NextResponse.json({
        message: `User with email ${email} not found.`,
        status: false,
      });
    }
    const passwordMatch = await compare(password, existUser.password);

    if (!passwordMatch) {
      return NextResponse.json({
        message: "Password Incorrect.",
        status: false,
      });
    }

    (await cookies()).set({
      name: "email",
      value: email,
      httpOnly: true,
      path: "/",
    });

    (await cookies()).set({
      name: "userId",
      value: existUser.id.toString(),
      httpOnly: true,
      path: "/",
    });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: MAX_AGE });

    const serialized = serialize("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: MAX_AGE,
    });
    const userInfo = {
      name: existUser.name,
      email: existUser.email,
    };

    return new Response(
      JSON.stringify({
        user: userInfo,
        message: "Authenticated",
        status: true,
      }),
      {
        headers: { "Set-Cookie": serialized },
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({
      message: error,
      status: 500,
      msg: "catch error",
    });
  }
};
