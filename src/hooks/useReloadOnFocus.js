import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

// React Navigation เก็บหน้าที่เปิดค้างไว้ useEffect ที่รันครั้งเดียวจึงไม่เห็นข้อมูลใหม่
// ใช้ hook นี้โหลดข้อมูลใหม่ทุกครั้งที่หน้ากลับมาอยู่ด้านหน้า (และเมื่อ load เปลี่ยน)
export function useReloadOnFocus(load) {
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
}
