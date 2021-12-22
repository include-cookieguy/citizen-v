export const convertTime = (seconds) => {
  seconds = seconds || 0;
  seconds = Number(seconds);
  seconds = Math.abs(seconds);

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];

  if (d > 0) {
    parts.push(d + " ngày trước");
  }

  if (h > 0) {
    parts.push(h + " giờ trước");
  }

  if (m > 0) {
    parts.push(m + " phút trước");
  }

  if (s > 0) {
    parts.push(s + " giây trước");
  }

  return parts[0];
};
