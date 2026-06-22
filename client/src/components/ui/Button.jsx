/**
 * Button – variants: primary | secondary | danger | ghost
 * Supports disabled and loading states.
 */
const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
};

export default function Button({
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "transition disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant] ?? variants.primary,
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
