import { createOpencodeClient } from "@opencode-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// Create the OpenCode client connecting to the existing server
const client = createOpencodeClient({
  baseUrl: "https://strejda.onrender.com",
  config: {
    model: "opencode/big-pickle",
  },
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Send the message to the OpenCode server
    const response = await client.chat({
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json({ response: response.content });
  } catch (error) {
    console.error("Error communicating with OpenCode server:", error);
    return NextResponse.json(
      { error: "Failed to communicate with OpenCode server" },
      { status: 500 }
    );
  }
}
