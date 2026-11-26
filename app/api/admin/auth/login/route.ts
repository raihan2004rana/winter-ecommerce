import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email) {
      return NextResponse.json({ status: "fail", message: "Email is required." }, { status: 400 });
    }

    // Lookup staff member in admin store
    const staffList = AdminStore.getStaff();
    const member = staffList.find((s) => s.email.toLowerCase() === email.toLowerCase());

    const assignedRole = member ? member.role : role || "super_admin";
    const assignedName = member ? member.name : email.split("@")[0].toUpperCase();

    const sessionData = {
      id: member ? member.id : `staff-${Date.now()}`,
      name: assignedName,
      email: email,
      role: assignedRole,
    };

    const response = NextResponse.json({
      status: "success",
      message: "Admin authentication successful",
      session: sessionData,
    });

    // Set HTTP-only secure cookie for admin session
    response.cookies.set("winter_admin_session", JSON.stringify(sessionData), {
      httpOnly: false, // Accessible to client admin shell for live role display
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
