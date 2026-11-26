import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    const canUpload =
      hasPermission(session.role, "products:write") ||
      hasPermission(session.role, "categories:write") ||
      hasPermission(session.role, "campaigns:write");

    if (!canUpload) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json(
        { status: "fail", message: "No file provided for upload" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target directory: public/images/{folder}
    const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "");
    const uploadDir = path.join(process.cwd(), "public", "images", safeFolder || "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename & create unique name
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    const uniqueFileName = `${baseName || "asset"}-${Date.now()}${ext.toLowerCase()}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${safeFolder || "uploads"}/${uniqueFileName}`;

    return NextResponse.json({
      status: "success",
      url: publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "File upload failed" },
      { status: 500 }
    );
  }
}
