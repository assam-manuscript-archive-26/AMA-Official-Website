import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function MajuliIntro() {
  return (
    <section className="py-16 md:py-16 px-4 md:px-6 bg-[var(--color-bg)] relative">
      {/* Grain texture overlay - only on section background, not inner content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/tileable-wood-colored.png')",
          opacity: 0.45,
        }}
      />
      <div className="max-w-[1330px] mx-auto relative z-">
        <div className="bg-[var(--color-bg-elevated)] rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Column - Text Content */}
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <h2 className="font-display text-2xl md:text-4xl text-[var(--color-text)] font-bold mb-6">
              Welcome to The Assamese Manuscript Archive :)
            </h2>
            <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
              {/* <p>
                Samaguri Satra is one of the oldest and most revered monastery of Majuli,world's smallest river island. It stands as a guardian of ancient manuscripts, traditional crafts, and spiritual wisdom.
              </p> */}
              <p>
                The Assamese Manuscript Archive is a digital gateway to Assam’s ancient manuscript heritage, preserving sacred texts, devotional writings, and literary treasures from sattras and monastic centers across the state.
              </p>
              {/* <p>
                Through our digital platform, we invite you to explore these treasures and experience the timeless charm of Majuli, a  glimpse into a civilization that has thrived on devotion, art, and harmony with nature.
              </p> */}
              <p>
                Explore this archive to uncover stories of faith and art to experience the timeless cultural world that shaped Assam’s manuscript tradition.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/knowMore"
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Learn More &#x279C;
                {/* <ArrowRight size={18} /> */}
              </a>
            </div>
          </div>

          {/* Right Column - Background Image */}
          <div className="hidden md:block md:w-1/2 relative min-h-[300px] lg:min-h-[400px]">
            {/* Using a gradient as placeholder - in production use herobg.jpg */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5db8a6] via-[#cc785c] to-[#181715]">
              {/* Decorative overlay pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="traditional-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <circle cx="30" cy="30" r="25" fill="none" stroke="#faf9f5" strokeWidth="1" />
                      <circle cx="30" cy="30" r="15" fill="none" stroke="#faf9f5" strokeWidth="0.5" />
                      <circle cx="30" cy="30" r="5" fill="#faf9f5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#traditional-pattern)" />
                </svg>
              </div>
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#faf9f5]/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-[#faf9f5] font-display text-4xl">স</span>
                  </div>
                  {/* <p className="text-[#faf9f5]/80 text-sm font-body">Samaguri Satra</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}