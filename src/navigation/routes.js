// ชื่อหน้าทั้งหมดของแอป ใช้ค่าคงที่แทนการพิมพ์ชื่อหน้าซ้ำหลายไฟล์
// ถ้าพิมพ์ชื่อหน้าผิด React Navigation จะรู้ตอนกดเท่านั้น แต่ถ้าพิมพ์ชื่อค่าคงที่ผิดจะได้ undefined ที่หาเจอง่ายกว่า

export const ROUTES = {
  // ชั้นนอกสุด
  welcome: "Welcome",
  main: "Main",

  // แท็บล่าง
  customerTab: "CustomerTab",
  kitchenTab: "KitchenTab",
  storeTab: "StoreTab",

  // แท็บลูกค้า
  tableSelect: "TableSelect",
  openTable: "OpenTable",
  menu: "Menu",
  cart: "Cart",
  bill: "Bill",

  // แท็บร้าน
  storeHome: "StoreHome",
  menuManage: "MenuManage",
  menuForm: "MenuForm",
};
