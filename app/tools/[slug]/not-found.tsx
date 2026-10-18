import Link from "next/link";

export default function ToolNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl font-bold gradient-text">404</span>
        <h1 className="text-2xl font-bold tracking-tight">Tool not found</h1>
        <p className="max-w-sm text-muted-foreground">
          The tool you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
      </div>
      <Link
        href="/tools"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Browse all tools
      </Link>
    </div>
  );
}
