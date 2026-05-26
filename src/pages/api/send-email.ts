import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { FeedbackThankYou } from '@/emails/FeedbackThankYou';
import { ContactReceived } from '@/emails/ContactReceived';

const FROM = 'Assamese Manuscript Archive <noreply@assammanuscriptarchive.com>';
const REPLY_TO = 'info@assammanuscriptarchive.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FeedbackPayload {
  name?: string;
  email: string;
  rating?: number;
  message?: string;
}

interface ContactPayload {
  fullName?: string;
  email: string;
  message?: string;
}

type Body =
  | { type: 'feedback'; payload: FeedbackPayload }
  | { type: 'contact'; payload: ContactPayload };

function json(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * 6-char uppercase ID derived from crypto.randomUUID(). Renders inside the
 * email as "Ref A91FZ4" — visible enough to look intentional, unique enough
 * to keep Gmail from collapsing repeated sends as quoted text.
 */
function shortRefId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
}

function humanDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function firstName(full?: string): string {
  if (!full) return '';
  const trimmed = full.trim();
  if (!trimmed) return '';
  return trimmed.split(/\s+/)[0];
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // @ts-ignore - locals.runtime is provided by the Cloudflare adapter
    const cfEnv = locals.runtime?.env;
    const apiKey =
      cfEnv?.RESEND_API_KEY ||
      import.meta.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('send-email: RESEND_API_KEY is not configured');
      return json(500, { error: 'Email service is not configured' });
    }

    const body = (await request.json()) as Body;

    if (!body || (body.type !== 'feedback' && body.type !== 'contact')) {
      return json(400, { error: 'Invalid email type' });
    }

    const { type, payload } = body;
    if (!payload?.email || !EMAIL_RE.test(payload.email)) {
      return json(400, { error: 'Invalid recipient email' });
    }

    const resend = new Resend(apiKey);
    const sentAt = humanDate();
    const refId = shortRefId();

    const result =
      type === 'feedback'
        ? await resend.emails.send({
            from: FROM,
            to: payload.email,
            replyTo: REPLY_TO,
            subject: `Thank you for your feedback${
              firstName(payload.name) ? `, ${firstName(payload.name)}` : ''
            }`,
            react: FeedbackThankYou({
              name: payload.name,
              rating: typeof payload.rating === 'number' ? payload.rating : 0,
              message: payload.message,
              sentAt,
              refId,
            }),
          })
        : await resend.emails.send({
            from: FROM,
            to: payload.email,
            replyTo: REPLY_TO,
            subject: `We've received your message${
              firstName((payload as ContactPayload).fullName)
                ? `, ${firstName((payload as ContactPayload).fullName)}`
                : ''
            }`,
            react: ContactReceived({
              fullName: (payload as ContactPayload).fullName,
              message: payload.message,
              sentAt,
              refId,
            }),
          });

    if (result.error) {
      console.error('send-email: Resend returned error', result.error);
      return json(502, { error: 'Failed to send email' });
    }

    return json(200, { ok: true, id: result.data?.id, refId });
  } catch (err) {
    console.error('send-email: unexpected error', err);
    return json(500, { error: 'Internal Server Error' });
  }
};
