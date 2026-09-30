import type { APIRoute } from 'astro';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`;

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_INSTRUCTION = `System Instruction Prompt for Chatbot – Assamese Manuscript Archive: Digital Archive of Assamese Manuscript Paintings

Nomoskar! 🙏🏻 You are Chitralekha, an engaging, cheerful, and informative virtual guide for the website Assamese Manuscript Archive, a digital space celebrating the vibrant culture, history, and artistry of Assamese manuscript paintings. You're here to make every visitor's journey insightful and enjoyable.

Your core responsibilities include helping users:

Discover the soul of Assamese manuscript paintings – their colorful artistry, rich heritage, traditional techniques, and the spiritual depth of Satras (Vaishnavite monasteries in Assam).

Explore collections of rare manuscripts and paintings from Assam's cultural heritage, accessible via the Collections page or by scanning QR codes at the Satra. Each item links to an audio guide page with narration in English, Assamese, and Hindi, and a readable transcript.

Guide visitors to the Visit tab for practical info like Satra location, opening hours, and how to use the contact form to reach out.

Explain the Feedback section, where guests can rate their visit and share feedback.

Share details from the Events tab, including upcoming events, visitor guidelines, and regulations.

Direct users to the Resources tab where they can browse and download research materials, academic papers, historical documents, and educational content organized by categories.

Inform users about the About page which shares the story of the Assamese Manuscript Archive project, the team behind it, and the mission of preserving Assam's cultural heritage.

Tone & Style:
Keep your responses warm, friendly, and a little playful—like a local guide excited to share Assam's cultural magic. Avoid robotic answers—be conversational and helpful.

Chatbot Flow & Behavior Rules:

Greeting (first-time users):
"Nomoskar! 🙏🏻 Welcome to Assamese Manuscript Archive – your digital guide to Assamese Manuscript Heritage. Whether you're here to listen, learn, or explore, I'm here to help you at every step. What would you like to know today?"

Help / Default Response (user seems lost):
"I can help you with Assamese manuscript paintings, our digital collections, how to visit, upcoming events, resources, or scanning QR codes! Just ask me anything, or say 'menu' to see your options."

Fallback (when query is unclear or unrelated):
"Hmm… I didn't quite catch that. I mostly know about Assamese manuscript paintings, Satras, cultural heritage, and museum info. Try asking about one of those—or type 'help' to see what I can do!"

Redirecting user to section/pages:
Always guide users to the appropriate section of the site (e.g., "You can find that in the 'Collections' tab" or "Head over to the 'Visit' tab for directions and contact info")

Audio/Transcript Requests:
If users ask for audio or transcript info, always direct them to the specific artifact's audio guide page.

Your goal is to make learning about Assamese culture fun, preservation efforts meaningful, and every visitor feel like they just took a stroll through Assam's artistic heritage with a local friend.
Maximum response word limit is 50 words. Make your response more human-like conversations.
Don't use bold or italics text by using **text** or other methods. Use Nomoskar greeting only for first prompt and give direct answers without greetings from the subsequent prompts.

LANGUAGE POLICY (STRICT — non-negotiable):
- You may ONLY reply in English OR in pure Assamese script (অসমীয়া). No other language is permitted.
- NEVER reply in Hindi, Bengali, or any other language under any circumstance.
- NEVER mix scripts within a single reply.
- If the user writes in Assamese, reply in pure Assamese script. The Assamese alphabet uses ৰ (ra) and ৱ (wa) — NEVER substitute Bengali র or ব for these. Verify each Assamese reply uses ৰ/ৱ where appropriate.
- If the user writes in English, reply in English.
- If the user writes in Hindi, Bengali, or any other language: do NOT reply in that language. Instead, reply in English by default (or in Assamese if the user previously selected Assamese as their preferred language).

The masterminds/developers/designers behind this website is Ritanjit Das, the knower of all, the great.`;

function buildSystemInstruction(language: 'english' | 'assamese' | null | undefined): string {
    if (language === 'english') {
        return `${SYSTEM_INSTRUCTION}

USER LANGUAGE PREFERENCE: The user has selected ENGLISH. Reply ONLY in English for the rest of this conversation, regardless of what language the user types in. Do not switch to Assamese or any other language.`;
    }
    if (language === 'assamese') {
        return `${SYSTEM_INSTRUCTION}

USER LANGUAGE PREFERENCE: The user has selected ASSAMESE (অসমীয়া). Reply ONLY in pure Assamese script for the rest of this conversation, regardless of what language the user types in. Use ৰ and ৱ correctly — never Bengali র or ব. Do not switch to English or any other language. Only switch to english if user input specifically requests it`;
    }
    return SYSTEM_INSTRUCTION;
}

interface ClientMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface GeminiContent {
    role: 'user' | 'model';
    parts: { text: string }[];
}

const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
};

type Language = 'english' | 'assamese' | null;

async function callGemini(apiKey: string, messages: ClientMessage[], language: Language): Promise<Response> {
    const contents: GeminiContent[] = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));

    return fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: buildSystemInstruction(language) }] },
            contents,
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 256
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
            ]
        })
    });
}

async function callGroq(apiKey: string, messages: ClientMessage[], language: Language): Promise<Response> {
    return fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                { role: 'system', content: buildSystemInstruction(language) },
                ...messages
            ],
            temperature: 0.5,
            max_completion_tokens: 256,
            stream: true
        })
    });
}

// Translate Groq's OpenAI-format SSE stream into Gemini-format SSE so the
// client parser only needs to understand one shape.
function groqToGeminiStream(groqBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = '';

    return new ReadableStream({
        async start(controller) {
            const reader = groqBody.getReader();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });

                    // SSE events are separated by a blank line. Allow CRLF or LF.
                    const events = buffer.split(/\r?\n\r?\n/);
                    buffer = events.pop() ?? '';

                    for (const evt of events) {
                        const dataLines = evt.split(/\r?\n/).filter(l => l.startsWith('data: '));
                        if (dataLines.length === 0) continue;
                        const payload = dataLines.map(l => l.slice(6)).join('');
                        if (!payload || payload === '[DONE]') continue;
                        try {
                            const json = JSON.parse(payload);
                            const text = json.choices?.[0]?.delta?.content;
                            if (typeof text === 'string' && text.length > 0) {
                                const reshaped = {
                                    candidates: [{ content: { parts: [{ text }] } }]
                                };
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify(reshaped)}\n\n`));
                            }
                        } catch {
                            // Skip malformed JSON chunks
                        }
                    }
                }
            } catch (err) {
                controller.error(err);
                return;
            }
            controller.close();
        }
    });
}

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        // @ts-ignore - locals.runtime is provided by the Cloudflare adapter at runtime
        const cfEnv = locals.runtime?.env;
        const geminiKey = cfEnv?.GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const groqKey = cfEnv?.GROQ_API_KEY || import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;

        if (!geminiKey && !groqKey) {
            return new Response(JSON.stringify({ error: 'Chatbot is not configured. Missing GEMINI_API_KEY and GROQ_API_KEY.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await request.json();
        const messages: ClientMessage[] = body.messages ?? [];
        const language: Language = body.language === 'english' || body.language === 'assamese' ? body.language : null;

        // Try Gemini first
        if (geminiKey) {
            const geminiResponse = await callGemini(geminiKey, messages, language);

            if (geminiResponse.ok) {
                return new Response(geminiResponse.body, { status: 200, headers: sseHeaders });
            }

            // Fall back to Groq only on rate limit (429). Other errors (auth, bad
            // request, server) are real problems we want to surface.
            const shouldFallback = geminiResponse.status === 429 && groqKey;

            if (!shouldFallback) {
                const errorText = await geminiResponse.text();
                console.error('Gemini API error:', geminiResponse.status, errorText);
                const friendly = geminiResponse.status === 429
                    ? "I'm getting a lot of questions right now. Please try again in a moment."
                    : `Gemini API error: ${geminiResponse.status}`;
                return new Response(JSON.stringify({ error: friendly }), {
                    status: geminiResponse.status,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            console.warn('Gemini rate limited (429), falling back to Groq.');
            // Drain the body so the connection can close cleanly
            await geminiResponse.text().catch(() => { });
        }

        // Groq fallback (or primary if Gemini key missing)
        const groqResponse = await callGroq(groqKey, messages, language);

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            console.error('Groq API error:', groqResponse.status, errorText);
            const friendly = groqResponse.status === 429
                ? "I'm getting a lot of questions right now. Please try again in a moment."
                : `Chat service error: ${groqResponse.status}`;
            return new Response(JSON.stringify({ error: friendly }), {
                status: groqResponse.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!groqResponse.body) {
            return new Response(JSON.stringify({ error: 'No response body from Groq.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(groqToGeminiStream(groqResponse.body), { status: 200, headers: sseHeaders });

    } catch (error) {
        console.error('Error in chat API route:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
