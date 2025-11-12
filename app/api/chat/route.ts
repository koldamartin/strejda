import { NextRequest, NextResponse } from 'next/server';
import { createOpencode } from '@opencode-ai/sdk';

// Global variable to store the OpenCode instance
let opencodeInstance: Awaited<ReturnType<typeof createOpencode>> | null = null;

// Initialize OpenCode with automatic server startup
async function getClient() {
  if (!opencodeInstance) {
    opencodeInstance = await createOpencode({
      hostname: process.env.OPENCODE_HOSTNAME || '127.0.0.1',
      port: process.env.OPENCODE_PORT ? parseInt(process.env.OPENCODE_PORT) : 4096,
      config: {
        model: 'free/Big Pickle' // Default model
      }
    });
  }
  return opencodeInstance.client;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const client = await getClient();

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
