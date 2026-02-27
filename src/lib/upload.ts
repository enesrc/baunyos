import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function uploadImage(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await sharp(buffer)
    .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filepath);

  return `/uploads/${filename}`;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const filename = url.replace("/uploads/", "");
    const filepath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filepath);
  } catch {
    // dosya zaten yoksa sessizce geç
  }
}

export async function uploadFile(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await fs.writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}