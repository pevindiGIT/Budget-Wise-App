export default function Select({ label, error, className = "", children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={[
          "input bg-white",
          error ? "border-red-400 focus:ring-red-400" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
