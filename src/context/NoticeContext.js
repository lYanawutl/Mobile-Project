import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getKitchenNoticeCount } from "../db/kitchenQueries";

// จำนวนข้อความ "ลูกค้ายกเลิก" ที่ครัวยังไม่รับทราบ แสดงเป็นตัวเลขบนแท็บครัว
// ตัวจริงอยู่ในฐานข้อมูล (cancel_ack_at) ที่นี่เก็บแค่ตัวเลขไว้ให้แท็บอ่าน

const NoticeContext = createContext(null);

export function NoticeProvider({ children }) {
  const db = useSQLiteContext();
  const [kitchenNoticeCount, setKitchenNoticeCount] = useState(0);

  const refreshKitchenNotices = useCallback(async () => {
    try {
      setKitchenNoticeCount(await getKitchenNoticeCount(db));
    } catch (error) {
      console.warn(error);
    }
  }, [db]);

  useEffect(() => {
    refreshKitchenNotices();
  }, [refreshKitchenNotices]);

  const value = useMemo(
    () => ({ kitchenNoticeCount, refreshKitchenNotices }),
    [kitchenNoticeCount, refreshKitchenNotices],
  );

  return (
    <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>
  );
}

export function useNotices() {
  const value = useContext(NoticeContext);
  if (value === null) {
    throw new Error("useNotices ต้องอยู่ภายใน NoticeProvider");
  }
  return value;
}
