"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadText } from "@/lib/download";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  filename: string;
  content: string;
  mime?: string;
  label?: string;
  className?: string;
}

export function DownloadButton({
  filename,
  content,
  mime = "text/plain",
  label,
  className,
}: DownloadButtonProps) {
  const isEmpty = content.trim().length === 0;

  function handleDownload() {
    if (isEmpty) return;
    downloadText(filename, content, mime);
    toast.success(`Downloaded ${filename}`);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size={label ? "default" : "icon"}
              onClick={handleDownload}
              disabled={isEmpty}
              aria-label={label ?? "Download"}
              className={cn(className)}
            />
          }
        >
          <Download className="size-4" />
          {label && <span className="ml-1">{label}</span>}
        </TooltipTrigger>
        <TooltipContent>
          {isEmpty ? "Nothing to download" : (label ?? `Download ${filename}`)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
