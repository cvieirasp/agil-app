import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have the required permissions to access this page.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 