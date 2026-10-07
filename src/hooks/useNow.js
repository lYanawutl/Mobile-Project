import { useEffect, useState } from "react";

// เวลาปัจจุบันที่อัปเดตเองทุก intervalMs ใช้กับข้อความอย่าง "รอมาแล้ว 5 นาที"
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
