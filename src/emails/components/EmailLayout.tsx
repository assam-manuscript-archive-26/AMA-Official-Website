import * as React from 'react';
import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

/**
 * Tokens mirror src/globals.css and DESIGN.md. Email clients drop CSS
 * variables, so values are inlined as hex.
 */
export const colors = {
  primary: '#cc785c',
  primaryActive: '#a9583e',
  gold: '#c9a227',
  teal: '#5db8a6',
  canvas: '#faf9f5',
  surfaceSoft: '#f5f0e8',
  surfaceCard: '#efe9de',
  surfaceCreamStrong: '#e8e0d2',
  surfaceDark: '#181715',
  hairline: '#e6dfd8',
  hairlineSoft: '#ebe6df',
  ink: '#141413',
  bodyStrong: '#252523',
  body: '#3d3d3a',
  muted: '#6c6a64',
  mutedSoft: '#8e8b82',
  onPrimary: '#ffffff',
  onDark: '#faf9f5',
  onDarkSoft: '#a09d96',
  white: '#ffffff',
} as const;

const SITE_URL = 'https://assammanuscriptarchive.com';
const LOGO_URL = `${SITE_URL}/assets/logo/logo.png`;

export const fonts = {
  display:
    '"Cormorant Garamond", Georgia, "Times New Roman", "Iowan Old Style", serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
} as const;

const navLinks = [
  { label: 'Home', href: `${SITE_URL}/` },
  { label: 'Collections', href: `${SITE_URL}/collections` },
  { label: 'Know More', href: `${SITE_URL}/knowMore` },
  { label: 'About', href: `${SITE_URL}/about` },
];

export interface EmailArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
}

interface EmailLayoutProps {
  preview: string;
  articles?: EmailArticle[];
  articlesIntro?: string;
  /** Human-readable send date, e.g. "26 May 2026". Drives Gmail de-threading. */
  sentAt?: string;
  /** Short unique reference, e.g. "A91FZ4". Drives Gmail de-threading. */
  refId?: string;
  children: React.ReactNode;
}

const ARTICLE_CARD_MIN_HEIGHT = 240;

// Mobile and Outlook handling. Two key behaviours:
//   1. On screens ≤600px the card goes full-bleed (no rounded corners, no
//      side gutter, no top padding) so the email feels native rather than a
//      floating postcard.
//   2. .desktop-pad keeps generous internal padding on desktop and tightens
//      to 20px on mobile so content doesn't feel cramped or oversized.
const RESPONSIVE_CSS = `
  body, table, td, p, a, li, blockquote {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

  @media only screen and (max-width: 600px) {
    .email-body { padding: 0 !important; }
    .email-shell {
      border-radius: 0 !important;
      border-left: 0 !important;
      border-right: 0 !important;
      border-top: 0 !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    .pad-x { padding-left: 20px !important; padding-right: 20px !important; }
    .pad-y-lg { padding-top: 28px !important; padding-bottom: 24px !important; }
    .pad-y-md { padding-top: 24px !important; padding-bottom: 20px !important; }
    .nav-row { text-align: left !important; }
    .nav-row .nav-link { display: inline-block !important; margin: 8px 12px 0 0 !important; }
    .stack-col {
      display: block !important;
      width: 100% !important;
      padding: 0 0 12px 0 !important;
    }
    .article-card {
      height: auto !important;
      min-height: 0 !important;
    }
    .display-xl { font-size: 28px !important; line-height: 34px !important; }
    .display-lg { font-size: 20px !important; line-height: 26px !important; }
    .hide-on-mobile { display: none !important; }
  }
`;

export function EmailLayout({
  preview,
  articles,
  articlesIntro,
  sentAt,
  refId,
  children,
}: EmailLayoutProps) {
  const articleList = articles ?? [];
  const hasTwo = articleList.length === 2;

  return (
    <Html lang="en">
      <Head>
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.woff2',
            format: 'woff2',
          }}
          fontWeight={500}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }}
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        className="email-body"
        style={{
          margin: 0,
          padding: '24px 0',
          backgroundColor: colors.surfaceSoft,
          fontFamily: fonts.body,
          color: colors.body,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <Container
          className="email-shell"
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            backgroundColor: colors.canvas,
            borderRadius: '16px',
            overflow: 'hidden',
            border: `1px solid ${colors.hairline}`,
          }}
        >
          {/* ── Header ─────────────────────────────────────── */}
          <Section
            className="pad-x"
            style={{
              padding: '22px 36px',
              borderBottom: `1px solid ${colors.hairline}`,
              backgroundColor: colors.canvas,
            }}
          >
            <Row>
              <Column style={{ width: '40%', verticalAlign: 'middle' }}>
                <Link href={SITE_URL} style={{ textDecoration: 'none' }}>
                  <Img
                    src={LOGO_URL}
                    alt="Assamese Manuscript Archive"
                    height="40"
                    style={{
                      display: 'block',
                      height: '40px',
                      width: 'auto',
                      border: '0',
                    }}
                  />
                </Link>
              </Column>
              <Column
                className="nav-row"
                style={{
                  width: '60%',
                  verticalAlign: 'middle',
                  textAlign: 'right',
                }}
              >
                {navLinks.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="nav-link"
                    style={{
                      color: colors.body,
                      fontFamily: fonts.body,
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      marginLeft: i === 0 ? '0' : '18px',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Column>
            </Row>
          </Section>

          {/* ── Body ───────────────────────────────────────── */}
          <Section
            className="pad-x pad-y-lg"
            style={{ padding: '44px 40px 36px 40px' }}
          >
            {children}
          </Section>

          {/* ── Articles ───────────────────────────────────── */}
          {articleList.length > 0 && (
            <>
              <Section className="pad-x" style={{ padding: '0 40px', margin: 0 }}>
                <Hr
                  style={{
                    border: 'none',
                    borderTop: `1px solid ${colors.hairline}`,
                    margin: 0,
                  }}
                />
              </Section>
              <Section
                className="pad-x pad-y-md"
                style={{ padding: '40px 40px 8px 40px' }}
              >
                <Text
                  style={{
                    margin: '0 0 8px 0',
                    fontFamily: fonts.body,
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: colors.muted,
                  }}
                >
                  Continue reading
                </Text>
                {articlesIntro && (
                  <Text
                    className="display-lg"
                    style={{
                      margin: '0 0 24px 0',
                      fontFamily: fonts.display,
                      fontSize: '24px',
                      lineHeight: '30px',
                      fontWeight: 500,
                      color: colors.ink,
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {articlesIntro}
                  </Text>
                )}

                <Row>
                  {articleList.map((article, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <Column
                        key={article.id}
                        className="stack-col"
                        style={{
                          width: hasTwo ? '50%' : '100%',
                          paddingRight: hasTwo && isFirst ? '8px' : '0',
                          paddingLeft: hasTwo && !isFirst ? '8px' : '0',
                          verticalAlign: 'top',
                        }}
                      >
                        <Section
                          className="article-card"
                          style={{
                            border: `1px solid ${colors.hairline}`,
                            borderRadius: '12px',
                            padding: '24px',
                            backgroundColor: colors.surfaceCard,
                            minHeight: `${ARTICLE_CARD_MIN_HEIGHT}px`,
                            height: `${ARTICLE_CARD_MIN_HEIGHT}px`,
                          }}
                        >
                          <Text
                            style={{
                              margin: '0 0 10px 0',
                              fontFamily: fonts.body,
                              fontSize: '11px',
                              fontWeight: 600,
                              letterSpacing: '0.16em',
                              textTransform: 'uppercase',
                              color: colors.primary,
                            }}
                          >
                            {article.category}
                          </Text>
                          <Text
                            style={{
                              margin: '0 0 10px 0',
                              fontFamily: fonts.display,
                              fontSize: '20px',
                              lineHeight: '26px',
                              fontWeight: 500,
                              color: colors.ink,
                              letterSpacing: '-0.005em',
                            }}
                          >
                            {article.title}
                          </Text>
                          <Text
                            style={{
                              margin: '0 0 16px 0',
                              fontFamily: fonts.body,
                              fontSize: '13px',
                              lineHeight: '20px',
                              color: colors.body,
                            }}
                          >
                            {article.excerpt}
                          </Text>
                          <Link
                            href={`${SITE_URL}/knowMore?id=${encodeURIComponent(
                              article.id,
                            )}`}
                            style={{
                              fontFamily: fonts.body,
                              fontSize: '13px',
                              fontWeight: 600,
                              color: colors.primary,
                              textDecoration: 'none',
                              letterSpacing: '0.01em',
                            }}
                          >
                            Read article →
                          </Link>
                        </Section>
                      </Column>
                    );
                  })}
                </Row>
              </Section>
            </>
          )}

          {/*
            ── Footer ──
            No <Hr> and no <Heading> here on purpose. Both signals make Gmail
            collapse content as "quoted text" when threading messages from the
            same sender. Visual separation comes from the surface-card band
            and the per-send reference line above it.
          */}
          {(sentAt || refId) && (
            <Section
              className="pad-x"
              style={{
                padding: '24px 40px 0 40px',
                margin: 0,
                textAlign: 'center',
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontFamily: fonts.body,
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.mutedSoft,
                  textAlign: 'center',
                }}
              >
                {sentAt}
                {sentAt && refId ? '   ·   ' : ''}
                {refId ? `Ref ${refId}` : ''}
              </Text>
            </Section>
          )}

          <Section
            className="pad-x pad-y-md"
            style={{
              padding: '24px 40px 36px 40px',
              textAlign: 'center',
              backgroundColor: colors.canvas,
            }}
          >
            <Text
              style={{
                margin: '0 0 10px 0',
                fontFamily: fonts.display,
                fontSize: '20px',
                fontWeight: 500,
                color: colors.ink,
                letterSpacing: '-0.005em',
                textAlign: 'center',
              }}
            >
              Assamese Manuscript Archive
            </Text>
            <Text
              style={{
                margin: '0 auto 14px auto',
                fontFamily: fonts.body,
                fontSize: '12px',
                lineHeight: '20px',
                color: colors.muted,
                maxWidth: '380px',
                textAlign: 'center',
              }}
            >
              Preserving the rich heritage of Assamese manuscript paintings for
              future generations. Majuli, Assam, India.
            </Text>
            <Text
              style={{
                margin: '0 0 6px 0',
                fontFamily: fonts.body,
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.muted,
                textAlign: 'center',
              }}
            >
              <Link
                href={`${SITE_URL}/privacy`}
                style={{ color: colors.muted, textDecoration: 'none' }}
              >
                Privacy
              </Link>
              {'  '}
              <Link
                href={`${SITE_URL}/terms`}
                style={{ color: colors.muted, textDecoration: 'none', marginLeft: '14px' }}
              >
                Terms
              </Link>
              {'  '}
              <Link
                href={`${SITE_URL}/visit`}
                style={{ color: colors.muted, textDecoration: 'none', marginLeft: '14px' }}
              >
                Contact
              </Link>
            </Text>
            <Text
              style={{
                margin: 0,
                fontFamily: fonts.body,
                fontSize: '11px',
                color: colors.mutedSoft,
                textAlign: 'center',
              }}
            >
              © {new Date().getFullYear()} Assamese Manuscript Archive
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default EmailLayout;
