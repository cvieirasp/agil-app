"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loading } from "@/components/custom/loading"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const scopeSchema = z.object({
  storyCode: z.string().min(1, "Story code is required"),
  scope: z.string().min(10, "Scope must be at least 10 characters"),
})

type ScopeFormData = z.infer<typeof scopeSchema>

export default function AgilDefinitionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ScopeFormData>({
    resolver: zodResolver(scopeSchema),
  })

  const onSubmit = async (data: ScopeFormData) => {
    setIsLoading(true)

    try {
      const environment = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "webhook" : "webhook-test"
      const webhookPath = process.env.NEXT_PUBLIC_N8N_WEBHOOK_PATH
      const webhookKey = process.env.NEXT_PUBLIC_N8N_WEBHOOK_KEY
      
      if (!webhookKey) {
        throw new Error("Webhook key is not configured")
      }

      console.log(environment, webhookKey)

      const response = await fetch(
        `https://cvieirasp.app.n8n.cloud/${environment}/${webhookPath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": webhookKey,
          },
          body: JSON.stringify({
            story_code: data.storyCode,
            application_scope: data.scope
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to submit scope")
      }

      toast.success("Your scope has been submitted successfully! We'll process it and update the definitions soon.")
      reset()
      router.push('/stories')
    } catch (error) {
      console.error("Error submitting scope:", error)
      toast.error("Failed to submit scope. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Agil Definitions</h1>
        <p className="mt-2 text-muted-foreground">
          Define your application scope to automatically generate Definition of Ready (DoR),
          Definition of Done (DoD), and Acceptance Criteria for your project.
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Application Scope</CardTitle>
          <CardDescription>
            Enter a detailed description of your application scope to generate agile definitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="storyCode" className="text-sm font-medium">
                  Story Code
                </label>
                <Input
                  id="storyCode"
                  placeholder="Enter story code..."
                  {...register("storyCode")}
                  aria-invalid={errors.storyCode ? "true" : "false"}
                  disabled={isLoading}
                />
                {errors.storyCode && (
                  <p className="text-sm text-destructive">{errors.storyCode.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="scope" className="text-sm font-medium">
                  Scope Description
                </label>
                <Textarea
                  id="scope"
                  placeholder="Enter your application scope..."
                  className="min-h-[200px] resize-y"
                  {...register("scope")}
                  aria-invalid={errors.scope ? "true" : "false"}
                  disabled={isLoading}
                />
                {errors.scope && (
                  <p className="text-sm text-destructive">{errors.scope.message}</p>
                )}
              </div>
            </div>
            <CardFooter className="flex flex-col space-y-4 px-0 mt-6">
              {isLoading ? (
                <Loading />
              ) : (
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || isLoading}
                >
                  Generate Definitions
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 