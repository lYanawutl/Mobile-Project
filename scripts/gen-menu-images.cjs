// สร้าง src/utils/menuImages.js จากไฟล์รูปในโฟลเดอร์ lip/
// วิธีใช้: วางรูปใน lip/ แล้วรัน  npm run images
//
// ทำไมต้องมีสคริปต์: React Native ต้องรู้ชื่อไฟล์รูปทุกไฟล์ตอน bundle
// require() ใช้ตัวแปรไม่ได้ ต้องเขียน require("...ชื่อไฟล์...") ทีละไฟล์
// สคริปต์นี้เขียนบรรทัดพวกนั้นให้ และเช็กว่า seed.js อ้างถึงรูปที่มีอยู่จริง

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMAGE_DIR = path.join(ROOT, "lip"); // โฟลเดอร์เก็บรูปเมนู
const SEED_FILE = path.join(ROOT, "src", "db", "seed.js");
const OUTPUT_FILE = path.join(ROOT, "src", "utils", "menuImages.js");
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const SAFE_NAME = /^[a-z0-9][a-z0-9._-]*$/;

// path จากไฟล์ที่สร้างไปหาโฟลเดอร์รูป ใช้ / เสมอ (Windows ใช้ \ ซึ่ง require ไม่รับ)
const requireDir = path
  .relative(path.dirname(OUTPUT_FILE), IMAGE_DIR)
  .split(path.sep)
  .join("/");

const files = fs.existsSync(IMAGE_DIR)
  ? fs.readdirSync(IMAGE_DIR).filter((name) => IMAGE_EXT.test(name)).sort()
  : [];

const entries = files.map(
  (name) => "  " + JSON.stringify(name) + ": require(" + JSON.stringify(requireDir + "/" + name) + "),",
);

const output = [
  "// สร้างอัตโนมัติด้วย scripts/gen-menu-images.cjs (npm run images) ห้ามแก้ด้วยมือ",
  "// key = ชื่อไฟล์ในโฟลเดอร์ lip/ ตรงกับคอลัมน์ menu_items.image ในฐานข้อมูล",
  "const MENU_IMAGES = {",
  ...entries,
  "};",
  "",
  "// ชื่อไฟล์รูปทั้งหมด ใช้ในหน้าเพิ่ม/แก้เมนูให้เลือกรูป",
  "export const MENU_IMAGE_NAMES = Object.keys(MENU_IMAGES);",
  "",
  "// คืนค่าสำหรับ <Image source={...} /> หรือ null ถ้าไม่มีรูป / ไม่พบไฟล์",
  "export function getMenuImage(imageName) {",
  "  if (!imageName) {",
  "    return null;",
  "  }",
  "  return MENU_IMAGES[imageName] ?? null;",
  "}",
  "",
].join("\n");

fs.writeFileSync(OUTPUT_FILE, output, "utf8");
console.log("เขียน", path.relative(ROOT, OUTPUT_FILE), "แล้ว:", files.length, "รูป");

// รูปใหญ่ทำให้แอปใหญ่ และหน้าเมนูกินหน่วยความจำ/เลื่อนช้า
const LARGE_FILE_KB = 300;
for (const name of files) {
  if (!SAFE_NAME.test(name)) {
    console.warn("คำเตือน: ชื่อไฟล์ควรเป็นตัวพิมพ์เล็ก อังกฤษ ตัวเลข - _ เท่านั้น ->", name);
  }
  const sizeKb = Math.round(fs.statSync(path.join(IMAGE_DIR, name)).size / 1024);
  if (sizeKb > LARGE_FILE_KB) {
    console.warn("คำเตือน: รูปใหญ่", sizeKb, "KB ควรย่อให้ด้านยาวไม่เกิน 1200 px ->", name);
  }
}

let hasError = false;
if (fs.existsSync(SEED_FILE)) {
  // ข้ามบรรทัดคอมเมนต์ เพื่อไม่ให้ตัวอย่างในคำอธิบายถูกนับเป็นรูปที่ใช้จริง
  const seedText = fs
    .readFileSync(SEED_FILE, "utf8")
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  const used = [...seedText.matchAll(/image:\s*"([^"]+)"/g)].map((match) => match[1]);
  for (const name of used) {
    if (!files.includes(name)) {
      console.error("ผิดพลาด: seed.js ใช้รูป", name, "แต่ไม่พบไฟล์ในโฟลเดอร์ lip/");
      hasError = true;
    }
  }
}

process.exit(hasError ? 1 : 0);
