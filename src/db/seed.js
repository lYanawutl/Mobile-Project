// ข้อมูลตั้งต้น: หมวดหมู่ เมนู ตัวเลือก และโต๊ะ
// ราคาเป็นจำนวนเต็มหน่วยบาท ทุกค่าส่งเข้า SQL ผ่านเครื่องหมาย ? เท่านั้น
// รูปเมนู: วางไฟล์รูปในโฟลเดอร์ lip/ แล้วใส่ชื่อไฟล์ในรายการที่ต้องการ (ไม่ใส่ = ไม่มีรูป) เช่น
//   { name: "กะเพราหมูสับ", price: 60, options: RICE_OPTIONS, image: "kra-prao.jpg" },
// เสร็จแล้วรัน npm run images เพื่อสร้าง src/utils/menuImages.js ใหม่

const TABLE_COUNT = 15;

const SEED_OPTIONS = [
  { name: "ไข่ดาว", priceDelta: 10 },
  { name: "พิเศษ", priceDelta: 10 },
  { name: "ไข่มุก", priceDelta: 10 },
];

const RICE_OPTIONS = ["ไข่ดาว", "พิเศษ"];
const DRINK_OPTIONS = ["ไข่มุก"];

// 5 หมวด รวม 27 รายการ (โจทย์ขั้นต่ำ 4 หมวด หมวดละ 5 รวม 25)
const SEED_MENU = [
  {
    name: "อาหารจานเดียว",
    items: [
      { name: "กะเพราหมูสับ", price: 60, options: RICE_OPTIONS, image: "kra-prao.jpg" },
      { name: "ข้าวผัดกุ้ง", price: 70, options: RICE_OPTIONS, image: "shrimp-fried-rice.jpg" },
      { name: "ผัดซีอิ๊ว", price: 60, options: RICE_OPTIONS, image: "stir-fried.jpg" },
      { name: "ข้าวมันไก่", price: 55, options: RICE_OPTIONS, image: "chicken-rice.jpg" },
      { name: "ราดหน้า", price: 60, options: RICE_OPTIONS, image: "noodle-soup.jpg" },
      { name: "ข้าวไข่เจียวหมูสับ", price: 50, options: RICE_OPTIONS, image: "egg-fried-rice.jpg" },
    ],
  },
  {
    name: "กับข้าว",
    items: [
      { name: "ต้มยำกุ้ง", price: 150, image: "tom-yum-shrimp.jpg" },
      { name: "แกงเขียวหวานไก่", price: 90, image: "green-curry-chicken.jpg" },
      { name: "ผัดผักบุ้งไฟแดง", price: 80, image: "stir-fried-vegetables.jpg" },
      { name: "ปลาทอดน้ำปลา", price: 120, image: "fried-fish.jpg" },
      { name: "ไข่พะโล้", price: 70, image: "egg-curry.jpg" },
    ],
  },
  {
    name: "ยำและของทานเล่น",
    items: [
      { name: "ส้มตำไทย", price: 60, image: "som-tum.jpg" },
      { name: "ยำวุ้นเส้น", price: 80, image: "yam-noodle.jpg" },
      { name: "ปีกไก่ทอด", price: 80, image: "fried-chicken-wing.jpg" },
      { name: "ลาบหมู", price: 80, image: "larb-pork.jpg" },
      { name: "เฟรนช์ฟรายส์", price: 59, image: "french-fries.jpg" },
    ],
  },
  {
    name: "เครื่องดื่ม",
    items: [
      { name: "ชาเย็น", price: 35, options: DRINK_OPTIONS, image: "tea.jpg" },
      { name: "กาแฟเย็น", price: 45, options: DRINK_OPTIONS, image: "iced-coffee.jpg" },
      { name: "ชามะนาว", price: 35, options: DRINK_OPTIONS, image: "lemon-tea.jpg" },
      { name: "น้ำมะนาวโซดา", price: 40, image: "lemon-soda.jpg" },
      { name: "น้ำส้มคั้น", price: 50, image: "orange-juice.jpg" },
      { name: "น้ำเปล่า", price: 15, image: "water.jpg" },
    ],
  },
  {
    name: "ของหวาน",
    items: [
      { name: "บัวลอย", price: 40, image: "mango-juice.jpg" },
      { name: "ข้าวเหนียวมะม่วง", price: 90, image: "mango-rice.jpg" },
      { name: "ไอศกรีมกะทิ", price: 45, image: "coconut-ice-cream.jpg" },
      { name: "เฉาก๊วยนมสด", price: 40, image: "milk-bubble-tea.jpg" },
      { name: "ทับทิมกรอบ", price: 45, image: "crispy-sweet-potato.jpg" },
    ],
  },
];

// ต้องเรียกภายในทรานแซกชันที่ผู้เรียกเปิดไว้ (initDB และ resetAllData)
// เพื่อให้ใส่ข้อมูลตั้งต้นสำเร็จทั้งชุดหรือไม่เข้าเลย
export async function seedInitialData(db) {
  const optionIds = new Map();
  for (const option of SEED_OPTIONS) {
    const result = await db.runAsync(
      "INSERT INTO options (name, price_delta) VALUES (?, ?)",
      [option.name, option.priceDelta],
    );
    optionIds.set(option.name, result.lastInsertRowId);
  }

  for (const category of SEED_MENU) {
    const categoryResult = await db.runAsync(
      "INSERT INTO categories (name) VALUES (?)",
      [category.name],
    );

    for (const item of category.items) {
      const itemResult = await db.runAsync(
        "INSERT INTO menu_items (category_id, name, price, image) VALUES (?, ?, ?, ?)",
        [categoryResult.lastInsertRowId, item.name, item.price, item.image ?? null],
      );

      for (const optionName of item.options ?? []) {
        await db.runAsync(
          "INSERT INTO menu_item_options (menu_item_id, option_id) VALUES (?, ?)",
          [itemResult.lastInsertRowId, optionIds.get(optionName)],
        );
      }
    }
  }

  for (let tableNo = 1; tableNo <= TABLE_COUNT; tableNo++) {
    await db.runAsync("INSERT INTO dining_tables (table_no) VALUES (?)", [
      tableNo,
    ]);
  }
}
