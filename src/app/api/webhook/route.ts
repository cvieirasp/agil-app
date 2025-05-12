import { Webhook } from "svix"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

// Define the expected payload type
interface N8nWebhookPayload {
  definitionOfReady: string
  definitionOfDone: string
  acceptanceCriteria: string
  timestamp: string
  signature?: string // Make signature optional for local development
}

// Verify the webhook signature
async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  // Skip verification in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: Skipping signature verification")
    return true
  }

  const webhookSecret = process.env.N8N_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("N8N_WEBHOOK_SECRET is not configured")
  }

  const wh = new Webhook(webhookSecret)
  try {
    wh.verify(payload, {
      "svix-signature": signature,
      "svix-timestamp": new Date().toISOString(),
      "svix-id": "n8n-webhook"
    })
    return true
  } catch (err) {
    console.error("Webhook verification failed:", err)
    return false
  }
}

export async function POST(req: Request) {
  try {
    // Get the headers
    const headersList = await headers()
    const signature = headersList.get("svix-signature")

    // Skip signature check in development mode
    if (process.env.NODE_ENV !== "development" && !signature) {
      return new NextResponse("No signature provided", { status: 401 })
    }

    // Get the body
    const payload = await req.text()
    
    // Verify the webhook signature (skipped in development)
    const isValid = await verifyWebhookSignature(payload, signature || "")
    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 401 })
    }

    // Parse the payload
    const data: N8nWebhookPayload = JSON.parse(payload)

    // Validate required fields
    if (!data.definitionOfReady || !data.definitionOfDone || !data.acceptanceCriteria) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Log the received data
    console.log("Received webhook data:", {
      definitionOfReady: data.definitionOfReady,
      definitionOfDone: data.definitionOfDone,
      acceptanceCriteria: data.acceptanceCriteria,
      timestamp: data.timestamp,
      environment: process.env.NODE_ENV
    })

    return new NextResponse("Webhook processed successfully", { status: 200 })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 