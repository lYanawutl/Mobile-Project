import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

// ตะกร้าของรอบที่กำลังจะสั่ง ผูกกับบิลหนึ่งใบ ยังไม่ลงฐานข้อมูลจนกว่าจะกดส่งเข้าครัว

const CartContext = createContext(null);

function sameLine(a, line) {
  return (
    a.menuItemId === line.menuItemId &&
    a.note === line.note &&
    [...a.optionIds].sort().join(",") === [...line.optionIds].sort().join(",")
  );
}

export function CartProvider({ children }) {
  const [billId, setBillId] = useState(null);
  const [lines, setLines] = useState([]);
  const nextKey = useRef(1);
  const billIdRef = useRef(null);

  // ผูกตะกร้ากับบิล ถ้าเป็นคนละบิลกับที่ค้างอยู่ให้ล้างตะกร้า
  const bindBill = useCallback((id) => {
    if (billIdRef.current !== id) {
      billIdRef.current = id;
      setBillId(id);
      setLines([]);
    }
  }, []);

  const addLine = useCallback((line) => {
    setLines((current) => {
      const existing = current.find((item) => sameLine(item, line));
      if (existing) {
        return current.map((item) =>
          item.key === existing.key
            ? { ...item, quantity: item.quantity + line.quantity }
            : item,
        );
      }
      const key = nextKey.current;
      nextKey.current += 1;
      return [...current, { ...line, key }];
    });
  }, []);

  // จำนวนเป็น 0 หรือน้อยกว่า = เอารายการออก
  const setQuantity = useCallback((key, quantity) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) =>
            item.key === key ? { ...item, quantity } : item,
          ),
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((count, item) => count + item.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ billId, lines, itemCount, bindBill, addLine, setQuantity, clearCart }),
    [billId, lines, itemCount, bindBill, addLine, setQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (value === null) {
    throw new Error("useCart ต้องอยู่ภายใน CartProvider");
  }
  return value;
}
