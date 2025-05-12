import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <SignIn />
    </div>
  )
} 