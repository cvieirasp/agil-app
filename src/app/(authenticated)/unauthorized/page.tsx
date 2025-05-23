import { Card } from "@/components/ui/card"
import { ExclamationCircleIcon } from "@heroicons/react/24/solid"

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center">
          Access Denied
        </h2>
        <div className="flex justify-center mt-4">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
        </div>
        <p className="mt-2 text-muted-foreground text-center">
          You don't have the required permissions to access this page.
        </p>
      </Card>
    </div>
  )
}
