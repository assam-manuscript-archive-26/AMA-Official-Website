import React from "react";
import { Home, ArrowLeft, Map, Search } from "lucide-react";
import FuzzyText from "@/components/react/ui/FuzzyText";

const PageNotFound: React.FC = () => {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 pt-32 sm:pt-40 pb-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-2xl mx-auto text-center relative">

        {/* ── Fuzzy 404 ────────────────────────────────────── */}
        <div className="flex justify-center items-center mb-2">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover
            fontSize="clamp(5rem, 12vw, 8rem)"
            fontWeight={900}
            color="var(--color-primary)"
          >
            404
          </FuzzyText>
        </div>

        {/* ── Fuzzy subtitle ──────────────────────────────── */}
        <div className="flex justify-center items-center mb-4">
          <FuzzyText
            baseIntensity={0.10}
            hoverIntensity={0.4}
            enableHover
            fontSize="clamp(1.1rem, 3vw, 2rem)"
            fontWeight={700}
            color="var(--color-primary)"
          >
            Page Not Found :(
          </FuzzyText>
        </div>

        {/* ── Decorative Divider ──────────────────────────── */}
        <div
          className="w-24 h-1 mx-auto rounded-full mb-6"
          style={{
            background:
              "linear-gradient(to right, var(--color-primary), var(--color-primary-active))",
          }}
        />

        {/* ── Fuzzy subtitle ──────────────────────────────── */}
        <div className="flex justify-center items-center mb-4">
          <FuzzyText
            baseIntensity={0.08}
            hoverIntensity={0.4}
            enableHover
            fontSize="clamp(1.1rem, 3vw, 2rem)"
            fontWeight={700}
            color="var(--color-primary)"
          >
            পৃষ্ঠা পোৱা নগল
          </FuzzyText>
        </div>

        {/* ── Action Buttons ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 btn-primary px-6 py-3 rounded-[var(--radius-md)] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <a
            href="/"
            className="group flex items-center gap-2 btn-secondary px-6 py-3 rounded-[var(--radius-md)] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl no-underline"
          >
            <Home className="w-4 h-4" />
            Return Home
          </a>
        </div>

        {/* ── Helpful Links ───────────────────────────────── */}
        <div
          className="pt-8 mt-12"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p
            className="text-sm mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            You might want to explore:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="/visit"
              className="group flex items-center gap-2 text-sm no-underline transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-secondary)")
              }
            >
              <Map className="w-4 h-4" />
              Visit Museum
            </a>
            <a
              href="/collections"
              className="group flex items-center gap-2 text-sm no-underline transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-secondary)")
              }
            >
              <Search className="w-4 h-4" />
              Search Collection
            </a>
          </div>
        </div>

        {/* ── Cultural Quote ──────────────────────────────── */}
        <div
          className="mt-12 p-6 rounded-[var(--radius-lg)]"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
          }}
        >
          <blockquote
            className="italic font-display text-lg"
            style={{ color: "var(--color-text)" }}
          >
            &ldquo;যত আছে মোৰ দেহত প্ৰাণ, সিমান আছে মোৰ আশা&rdquo;
          </blockquote>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
            — Traditional Assamese Wisdom
          </p>
        </div>

        {/* ── Ambient Particles ────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{ top: "25%", left: "25%", backgroundColor: "var(--color-primary)", opacity: 0.15 }}
          />
          <div
            className="absolute w-1 h-1 rounded-full animate-ping"
            style={{ top: "33%", right: "33%", backgroundColor: "var(--color-primary)", opacity: 0.2, animationDelay: "1s" }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full animate-ping"
            style={{ bottom: "33%", right: "33%", backgroundColor: "var(--color-primary)", opacity: 0.18, animationDelay: "2s" }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full animate-ping"
            style={{ bottom: "50%", left: "33%", backgroundColor: "var(--color-primary)", opacity: 0.18, animationDelay: "1.5s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
