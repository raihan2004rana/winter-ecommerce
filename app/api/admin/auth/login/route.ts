import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPassword = (password || "").trim();

    if (!trimmedEmail) {
      return NextResponse.json({ status: "fail", message: "Email is required." }, { status: 400 });
    }

    if (!trimmedPassword) {
      return NextResponse.json({ status: "fail", message: "Password is required." }, { status: 400 });
    }

    // Standard valid admin security passwords
    const validPasswords = [
      "admin123",
      "mauli2026",
      "admin@2026",
      "demo",
      process.env.ADMIN_PASSWORD,
    ].filter(Boolean);

    // Verify password
    if (!validPasswords.includes(trimmedPassword)) {
      return NextResponse.json(
        { status: "fail", message: "Invalid email or security password." },
        { status: 401 }
      );
    }

    // Lookup staff member in admin store
    const staffList = AdminStore.getStaff();
    const member = staffList.find((s) => s.email.toLowerCase() === trimmedEmail);

    // Verify if recognized staff or super admin
    const isSuperAdminEmail =
      trimmedEmail === "admin@winter-fashion.com" ||
      trimmedEmail === "admin@mauli-fashion.com" ||
      trimmedEmail === "raihan.rana@mauli-fashion.com";

    if (!member && !isSuperAdminEmail) {
      return NextResponse.json(
        { status: "fail", message: "Unrecognized administrative staff email." },
        { status: 403 }
      );
    }

    const assignedRole = member ? member.role : role || "super_admin";
    const assignedName = member ? member.name : "Raihan Rana";

    const sessionData = {
      id: member ? member.id : "staff-1",
      name: assignedName,
      email: trimmedEmail,
      role: assignedRole,
    };

    const response = NextResponse.json({
      status: "success",
      message: "Admin authentication successful",
      session: sessionData,
    });

    // Set secure cookie for admin session
    response.cookies.set("winter_admin_session", JSON.stringify(sessionData), {
      httpOnly: false,
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
