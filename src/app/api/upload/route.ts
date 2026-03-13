import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadFile } from "@/lib/upload";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isImage = IMAGE_EXTS.includes(ext);
  const url = isImage ? await uploadImage(file) : await uploadFile(file);

  return NextResponse.json({ url });
}