import { NextRequest, NextResponse } from 'next/server';
import { createOpencodeClient } from '@opencode-ai/sdk';

// Initialize OpenCode client (connecting to existing instance or local server)
const getClient = () => {
  return createOpencodeClient({
    baseUrl: process.env.OPENCODE_URL || 'http://localhost:4096'
  });
};

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const client = getClient();

    // Create a new session
    const sessionResponse = await client.session.create({
      body: {}
    });

    if (!sessionResponse.data?.id) {
      throw new Error('Failed to create session');
    }

    const sessionId = sessionResponse.data.id;

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;

    // Send prompt to OpenCode using Big Pickle model
    const result = await client.session.prompt({
      path: { id: sessionId },
      body: {
        model: {
          providerID: 'free',
          modelID: 'Big Pickle'
        },
        parts: [
          {
            type: 'text',
            text: userPrompt
          }
        ]
      }
    });

    // Extract the response content
    const parts = result.data?.parts || [];
    const textPart = parts.find((part: any) => part.type === 'text') as any;
    const responseContent = textPart?.text || 'No response from agent';

    return NextResponse.json({
      message: responseContent
    });

  } catch (error) {
    console.error('OpenCode API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get response from OpenCode agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
