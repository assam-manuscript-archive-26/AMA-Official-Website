import type { APIRoute } from 'astro';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        // Read API key securely from the environment
        // It checks Cloudflare runtime env first, then falls back to import.meta.env / process.env for local dev
        // @ts-ignore - locals.runtime might not be typed if env.d.ts is missing it
        const cfEnv = locals.runtime?.env;
        const apiKey = cfEnv?.GROQ_API_KEY || import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Chatbot is not configured. Missing GROQ_API_KEY.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await request.json();
        const { messages } = body;

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: messages,
                temperature: 0.5,
                max_completion_tokens: 256,
                stream: true
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Groq API error:', response.status, errorData);
            return new Response(JSON.stringify({ error: `Groq API error: ${response.status}` }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Return the stream directly to the client
        return new Response(response.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        });

    } catch (error) {
        console.error('Error in chat API route:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
