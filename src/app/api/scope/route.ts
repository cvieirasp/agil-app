import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { storyCode, scope } = body

    if (!storyCode || !scope) {
      return NextResponse.json(
        { error: "Story code and scope are required" },
        { status: 400 }
      )
    }

    const environment = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "webhook" : "webhook-test"
    const webhookPath = process.env.N8N_WEBHOOK_PATH
    const webhookKey = process.env.N8N_WEBHOOK_KEY
    
    if (!webhookKey) {
      return NextResponse.json(
        { error: "Webhook key is not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://cvieirasp.app.n8n.cloud/${environment}/${webhookPath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": webhookKey,
        },
        body: JSON.stringify({
          story_code: storyCode,
          application_scope: scope
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to submit scope to n8n")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in scope submission:", error)
    return NextResponse.json(
      { error: "Failed to submit scope" },
      { status: 500 }
    )
  }
} 