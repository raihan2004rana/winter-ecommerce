import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    status: "success",
    message: "Admin session terminated successfully.",
  });

  response.cookies.set("winter_admin_session", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
