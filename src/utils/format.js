export function formatBaht(amount) {
  return `฿${Number(amount).toLocaleString("en-US")}`;
}

export function formatDateTime(text) {
  if (!text) {
    return "";
  }
  const [date, time] = text.split(" ");
  const [, month, day] = date.split("-");
  return `${Number(day)}/${Number(month)} ${time.slice(0, 5)}`;
}

export function formatTime(text) {
  if (!text) {
    return "";
  }
  return text.split(" ")[1].slice(0, 5);
}

export function parseLocalDateTime(text) {
  const [date, time] = text.split(" ");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

export function formatWaiting(text, now) {
  const minutes = Math.floor(
    (now - parseLocalDateTime(text).getTime()) / 60000,
  );
  return minutes < 1 ? "เพิ่งสั่ง" : `รอมาแล้ว ${minutes} นาที`;
}
