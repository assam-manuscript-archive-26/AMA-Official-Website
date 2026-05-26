import * as React from 'react';
import { Heading, Section, Text } from '@react-email/components';
import {
  EmailLayout,
  colors,
  fonts,
  type EmailArticle,
} from './components/EmailLayout';

interface ContactReceivedProps {
  fullName?: string;
  message?: string;
  sentAt?: string;
  refId?: string;
}

const articles: EmailArticle[] = [
  {
    id: 'majuli-assamese-manuscripts',
    title: 'Majuli & Assamese Manuscripts',
    excerpt:
      'Discover the rich history of Majuli, the Sattras, and the timeless tradition of manuscript preservation.',
    category: 'Heritage',
  },
  {
    id: 'mask-making-samaguri-sattra',
    title: 'Mask Making at Samaguri Sattra',
    excerpt:
      'Explore the mask-making tradition of Samaguri Sattra, an art form rooted in Neo-Vaishnavite heritage.',
    category: 'Art & Craft',
  },
];

export function ContactReceived({
  fullName = 'there',
  message = '',
  sentAt,
  refId,
}: ContactReceivedProps) {
  return (
    <EmailLayout
      preview={`We've received your message, ${fullName}`}
      articles={articles}
      articlesIntro="Until then, learn more about us"
      sentAt={sentAt}
      refId={refId}
    >
      {/* Eyebrow */}
      <Text
        style={{
          margin: '0 0 14px 0',
          fontFamily: fonts.body,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: colors.primary,
        }}
      >
        Message received
      </Text>

      <Heading
        as="h1"
        style={{
          margin: '0 0 16px 0',
          fontFamily: fonts.display,
          fontSize: '34px',
          lineHeight: '40px',
          fontWeight: 500,
          color: colors.ink,
          letterSpacing: '-0.01em',
        }}
      >
        Thanks for reaching out, {fullName}.
      </Heading>
      <Text
        style={{
          margin: '0 0 28px 0',
          fontFamily: fonts.body,
          fontSize: '15px',
          lineHeight: '24px',
          color: colors.body,
        }}
      >
        We've received your message and our team will get back to you within 24
        hours. If your enquiry is urgent, you can reach us directly at{' '}
        <span style={{ color: colors.primary, fontWeight: 600 }}>
          info@assammanuscriptarchive.com
        </span>
        .
      </Text>

      {/* Confirmation card with message echo */}
      <Section
        style={{
          border: `1px solid ${colors.hairline}`,
          borderRadius: '12px',
          padding: '24px 26px',
          backgroundColor: colors.surfaceCard,
          marginBottom: '8px',
        }}
      >
        <Text
          style={{
            margin: '0 0 12px 0',
            fontFamily: fonts.body,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: colors.muted,
          }}
        >
          Your message
        </Text>
        <Text
          style={{
            margin: 0,
            fontFamily: fonts.display,
            fontSize: '16px',
            lineHeight: '26px',
            color: colors.ink,
            whiteSpace: 'pre-wrap' as const,
            fontStyle: message ? 'italic' : 'normal',
          }}
        >
          {message || '—'}
        </Text>
      </Section>
    </EmailLayout>
  );
}

export default ContactReceived;
