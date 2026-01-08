// API Route: /api/gemini/generate
// POST: Generate content using Gemini with user's OAuth token

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { xorDecrypt } from '@/lib/encryption';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiGenerateRequest, GeminiGenerateResponse } from '@/types/index';

// POST /api/gemini/generate - Generate content using user's Gemini OAuth token
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    let body: GeminiGenerateRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body: must be valid JSON' },
        { status: 400 }
      );
    }

    const { prompt, context, max_tokens } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required field: prompt' },
        { status: 400 }
      );
    }

    // Get encryption key from environment
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      console.error('ENCRYPTION_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error: encryption key not available' },
        { status: 500 }
      );
    }

    // Fetch user's OAuth token from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_oauth_tokens')
      .select('access_token_encrypted, expires_at')
      .eq('user_id', session.user.id)
      .eq('provider', 'google_gemini')
      .single();

    if (tokenError || !tokenData) {
      console.error('Error fetching OAuth token:', tokenError);
      return NextResponse.json(
        { 
          error: 'OAuth token not found', 
          details: 'Please connect your Google Gemini account first' 
        },
        { status: 404 }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { 
          error: 'OAuth token expired', 
          details: 'Please reconnect your Google Gemini account' 
        },
        { status: 401 }
      );
    }

    // Decrypt the access token
    let decryptedToken: string;
    try {
      decryptedToken = xorDecrypt(tokenData.access_token_encrypted, encryptionKey);
    } catch (decryptError) {
      console.error('Error decrypting token:', decryptError);
      return NextResponse.json(
        { error: 'Failed to decrypt OAuth token' },
        { status: 500 }
      );
    }

    // Initialize Gemini with user's token
    const genAI = new GoogleGenerativeAI(decryptedToken);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build the full prompt with context if provided
    let fullPrompt = prompt;
    if (context && Object.keys(context).length > 0) {
      const contextStr = Object.entries(context)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
      fullPrompt = `Context:\n${contextStr}\n\nPrompt: ${prompt}`;
    }

    // Generate content
    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      const responseData: GeminiGenerateResponse = {
        text,
        model: 'gemini-pro',
      };

      return NextResponse.json({
        data: responseData,
        message: 'Content generated successfully',
      });

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      
      // Handle specific Gemini API errors
      if (geminiError.status === 401 || geminiError.message?.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Invalid API key', 
            details: 'Your Gemini API key is invalid. Please reconnect your account.' 
          },
          { status: 401 }
        );
      }

      if (geminiError.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded', 
            details: 'You have exceeded the API rate limit. Please try again later.' 
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to generate content', 
          details: geminiError.message || 'Unknown Gemini API error' 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Unexpected error in POST /api/gemini/generate:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
