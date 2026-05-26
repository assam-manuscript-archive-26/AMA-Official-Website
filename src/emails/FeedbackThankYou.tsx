import * as React from 'react';
import {
  Heading,
  Hr,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';
import {
  EmailLayout,
  colors,
  fonts,
  type EmailArticle,
} from './components/EmailLayout';

interface FeedbackThankYouProps {
  name?: string;
  rating?: number;
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

function StarRow({ rating }: { rating: number }) {
  return (
    <Text
      style={{
        margin: '4px 0 0 0',
        textAlign: 'center' as const,
        fontFamily: fonts.body,
        letterSpacing: '0.04em',
      }}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: '30px',
            lineHeight: '30px',
            color: s <= rating ? colors.gold : colors.hairline,
            display: 'inline-block',
            margin: '0 3px',
          }}
        >
          ★
        </span>
      ))}
    </Text>
  );
}

export function FeedbackThankYou({
  name = 'there',
  rating = 0,
  message,
  sentAt,
  refId,
}: FeedbackThankYouProps) {
  const trimmedMessage = message?.trim();

  return (
    <EmailLayout
      preview={`Thank you for your feedback, ${name}`}
      articles={articles}
      articlesIntro="You can also learn more about us"
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
        With gratitude
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
        Thank you, {name}.
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
        Your feedback genuinely helps us preserve and share the manuscript
        traditions of Assam. We've recorded your response and our team will read
        every word.
      </Text>

      {/* Rating recap */}
      <Section
        style={{
          border: `1px solid ${colors.hairline}`,
          borderRadius: '12px',
          padding: '26px 24px',
          backgroundColor: colors.surfaceCard,
          textAlign: 'center' as const,
          marginBottom: trimmedMessage ? '20px' : '8px',
        }}
      >
        <Text
          style={{
            margin: 0,
            fontFamily: fonts.body,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: colors.muted,
            textAlign: 'center' as const,
          }}
        >
          Your rating
        </Text>
        <StarRow rating={rating} />
        <Text
          style={{
            margin: '12px 0 0 0',
            fontFamily: fonts.display,
            fontSize: '15px',
            color: colors.bodyStrong,
            textAlign: 'center' as const,
            fontStyle: 'italic',
          }}
        >
          {rating} of 5
        </Text>
      </Section>

      {/* Testimonial / message recap */}
      {trimmedMessage && (
        <Section
          style={{
            padding: '26px 28px',
            backgroundColor: colors.canvas,
            border: `1px solid ${colors.hairline}`,
            borderLeft: `3px solid ${colors.primary}`,
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        >
          <Row>
            <Column style={{ textAlign: 'center' as const }}>
              <Text
                style={{
                  margin: '0 0 4px 0',
                  fontFamily: fonts.display,
                  fontSize: '40px',
                  lineHeight: '24px',
                  color: colors.primary,
                  textAlign: 'center' as const,
                  fontWeight: 500,
                }}
              >
                “
              </Text>
              <Text
                style={{
                  margin: '0 0 16px 0',
                  fontFamily: fonts.display,
                  fontStyle: 'italic',
                  fontSize: '17px',
                  lineHeight: '28px',
                  color: colors.ink,
                  textAlign: 'center' as const,
                }}
              >
                {trimmedMessage}
              </Text>
              <Hr
                style={{
                  border: 'none',
                  borderTop: `1px solid ${colors.hairline}`,
                  width: '40px',
                  margin: '0 auto 12px auto',
                }}
              />
              <Text
                style={{
                  margin: 0,
                  fontFamily: fonts.body,
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.muted,
                  textAlign: 'center' as const,
                }}
              >
                — {name}
              </Text>
            </Column>
          </Row>
        </Section>
      )}
    </EmailLayout>
  );
}

export default FeedbackThankYou;
