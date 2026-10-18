import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
  showGrid?: boolean;
}

export function GradientBackground({
  className,
  showGrid = true,
}: GradientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Violet blob */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-[120px]" />
      {/* Blue blob */}
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
      {/* Smaller accent blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-indigo-500/10 blur-[80px]" />
      {/* Grid overlay */}
      {showGrid && <div className="absolute inset-0 bg-grid opacity-50" />}
    </div>
  );
}
