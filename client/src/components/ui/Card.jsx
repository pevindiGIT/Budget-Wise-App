/** Card with optional header slot */
export default function Card({ title, action, children, className = "" }) {
  return (
    <div
      className={[
        "bg-white border border-gray-200 rounded-xl shadow-sm",
        className,
      ].join(" ")}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
