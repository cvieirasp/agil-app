import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <span className="ml-2 text-sm text-muted-foreground">Processing...</span>
    </div>
  )
} 