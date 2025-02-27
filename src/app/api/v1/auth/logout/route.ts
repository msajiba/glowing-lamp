import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async () => {
  (await cookies()).set("email", "", { expires: new Date(0) });
  (await cookies()).set("jwt", "", { expires: new Date(0) });
  return NextResponse.json({
    message: "Logged out successfully",
    status: true,
  });
};
