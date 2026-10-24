interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { spinner: "h-6 w-6 border-2", text: "text-xs", gap: "gap-2" },
  md: { spinner: "h-10 w-10 border-3", text: "text-sm", gap: "gap-3" },
  lg: { spinner: "h-16 w-16 border-4", text: "text-base", gap: "gap-4" },
};

export default function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center ${classes.gap}`}>
      <div
        className={`animate-spin rounded-full border-yellow-400/30 border-t-yellow-400 ${classes.spinner}`}
      />
      <span className={`text-gray-400 ${classes.text}`}>
        ಲೋಡ್ ಆಗುತ್ತಿದೆ...
      </span>
    </div>
  );
}
