import type { APIRoute } from 'astro';
import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const systemInstruction = `You are a helpful customer support AI for Infinity Code Labs, an IT solutions business based in Nepal.
You should answer user questions concisely and professionally. Focus only on IT services, software development, web development, mobile apps, and other related services offered by Infinity Code Labs.
Key Information about Infinity Code Labs:
- Owner and Developer: Baljit Mandal.
- For inquiries, project deals, or getting a website built, strongly encourage users to contact us directly via WhatsApp or Phone call at: +977 9807618948. 
- You may also provide the email: baljitmandal66@gmail.com.
If asked about things outside of Infinity Code Labs's services or general IT context, politely steer the conversation back or decline to answer.
Keep your answers relatively short. Use markdown for formatting when appropriate.`;

export const prerender = false;

// In-memory rate limiting map (IP -> timestamp array)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 12; // Max 12 chat requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, times] of rateLimitMap.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Determine client IP for rate limiting
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-client';

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a minute before sending more messages.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    const apiKey = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Chat API service is temporarily unconfigured. Please contact us via WhatsApp.' }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    const groq = new Groq({ apiKey });

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid JSON request payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      });
    }

    const { history, message } = body;

    // Strict input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message content is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      });
    }

    // Limit message length to 1000 chars to prevent token exhaust attack
    const cleanMessage = message.trim().slice(0, 1000);

    const messages = [{ role: 'system', content: systemInstruction }];

    // Sanitize and limit chat history length to max 10 turns
    if (Array.isArray(history)) {
      const sanitizedHistory = history.slice(-10);
      sanitizedHistory.forEach((msg: { role?: string; content?: string }) => {
        if (msg && typeof msg === 'object' && typeof msg.content === 'string') {
          const role = msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user';
          messages.push({
            role,
            content: msg.content.slice(0, 1000),
          });
        }
      });
    }

    messages.push({
      role: 'user',
      content: cleanMessage,
    });

    const chatCompletion = await groq.chat.completions.create({
      // @ts-expect-error - bypassing strict groq sdk type checking for messages
      messages: messages,
      model: 'llama-3.1-8b-instant',
      max_tokens: 500,
    });

    const responseText =
      chatCompletion.choices[0]?.message?.content ||
      'I apologize, but I am unable to generate a response at this time.';

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected server error occurred. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
    });
  }
};
