function monthRange(monthStr) {
  // monthStr: "YYYY-MM"
  if (!monthStr) return null;
  const [y, m] = monthStr.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { start, end };
}

module.exports = { monthRange };