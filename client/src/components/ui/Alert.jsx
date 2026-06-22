export default function Alert({ variant = "error", children }) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-orange-50 border-orange-200 text-orange-700",
  };
  return (
    <div
      className={`border rounded-lg px-4 py-3 text-sm ${styles[variant] ?? styles.error}`}
    >
      {children}
    </div>
  );
}
