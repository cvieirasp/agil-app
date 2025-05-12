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

    const webhookURL = process.env.N8N_WEBHOOK_URL
    const webhookKey = process.env.N8N_WEBHOOK_KEY
    
    if (!webhookKey || !webhookURL) {
      return NextResponse.json(
        { error: "Webhook key or URL is not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(
      webhookURL,
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