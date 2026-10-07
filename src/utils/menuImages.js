// สร้างอัตโนมัติด้วย scripts/gen-menu-images.cjs (npm run images) ห้ามแก้ด้วยมือ
// key = ชื่อไฟล์ในโฟลเดอร์ lip/ ตรงกับคอลัมน์ menu_items.image ในฐานข้อมูล
const MENU_IMAGES = {
  "chicken-rice.jpg": require("../../lip/chicken-rice.jpg"),
  "coconut-ice-cream.jpg": require("../../lip/coconut-ice-cream.jpg"),
  "crispy-sweet-potato.jpg": require("../../lip/crispy-sweet-potato.jpg"),
  "egg-curry.jpg": require("../../lip/egg-curry.jpg"),
  "egg-fried-rice.jpg": require("../../lip/egg-fried-rice.jpg"),
  "french-fries.jpg": require("../../lip/french-fries.jpg"),
  "fried-chicken-wing.jpg": require("../../lip/fried-chicken-wing.jpg"),
  "fried-fish.jpg": require("../../lip/fried-fish.jpg"),
  "green-curry-chicken.jpg": require("../../lip/green-curry-chicken.jpg"),
  "iced-coffee.jpg": require("../../lip/iced-coffee.jpg"),
  "kra-prao.jpg": require("../../lip/kra-prao.jpg"),
  "larb-pork.jpg": require("../../lip/larb-pork.jpg"),
  "lemon-soda.jpg": require("../../lip/lemon-soda.jpg"),
  "lemon-tea.jpg": require("../../lip/lemon-tea.jpg"),
  "mango-juice.jpg": require("../../lip/mango-juice.jpg"),
  "mango-rice.jpg": require("../../lip/mango-rice.jpg"),
  "milk-bubble-tea.jpg": require("../../lip/milk-bubble-tea.jpg"),
  "noodle-soup.jpg": require("../../lip/noodle-soup.jpg"),
  "orange-juice.jpg": require("../../lip/orange-juice.jpg"),
  "shrimp-fried-rice.jpg": require("../../lip/shrimp-fried-rice.jpg"),
  "som-tum.jpg": require("../../lip/som-tum.jpg"),
  "stir-fried-vegetables.jpg": require("../../lip/stir-fried-vegetables.jpg"),
  "stir-fried.jpg": require("../../lip/stir-fried.jpg"),
  "tea.jpg": require("../../lip/tea.jpg"),
  "tom-yum-shrimp.jpg": require("../../lip/tom-yum-shrimp.jpg"),
  "water.jpg": require("../../lip/water.jpg"),
  "yam-noodle.jpg": require("../../lip/yam-noodle.jpg"),
};

// ชื่อไฟล์รูปทั้งหมด ใช้ในหน้าเพิ่ม/แก้เมนูให้เลือกรูป
export const MENU_IMAGE_NAMES = Object.keys(MENU_IMAGES);

// คืนค่าสำหรับ <Image source={...} /> หรือ null ถ้าไม่มีรูป / ไม่พบไฟล์
export function getMenuImage(imageName) {
  if (!imageName) {
    return null;
  }
  return MENU_IMAGES[imageName] ?? null;
}
