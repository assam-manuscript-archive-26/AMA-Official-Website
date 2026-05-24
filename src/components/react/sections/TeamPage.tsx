import React from 'react';

export default function TeamPage() {
  return (
    <div className="team-page bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-text)] font-medium mb-6 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
            Our Team
          </h1>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
            <svg className="w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
          </div>
          <p className="mt-6 text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-sans">
            Meet the individuals behind the Assamese Manuscript Archive project
          </p>
        </div>
      </section>

      {/* Project Leadership Section */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-surface-soft)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] font-medium mb-4">
              Project Leadership
            </h2>
            <div className="w-12 h-0.5 bg-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto font-sans">
              Led by distinguished academics from Girijananda Chowdhury University
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Dr. Nilakshi Goswami */}
            <div className="bg-[var(--color-bg)] rounded-xl p-8 border border-[var(--color-border)] text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-surface-soft)] flex items-center justify-center">
                <span className="font-display text-3xl text-[var(--color-primary)]">NG</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--color-text)] font-medium mb-2">
                Dr. Nilakshi Goswami
              </h3>
              <p className="text-[var(--color-primary)] font-medium uppercase tracking-wider text-sm mb-4 font-sans">
                Principal Coordinator
              </p>
              <p className="text-[var(--color-text-secondary)] font-sans">
                Girijananda Chowdhury University, Assam
              </p>
            </div>

            {/* Dr. Shrabani Medhi */}
            <div className="bg-[var(--color-bg)] rounded-xl p-8 border border-[var(--color-border)] text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-surface-soft)] flex items-center justify-center">
                <span className="font-display text-3xl text-[var(--color-primary)]">SM</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--color-text)] font-medium mb-2">
                Dr. Shrabani Medhi
              </h3>
              <p className="text-[var(--color-primary)] font-medium uppercase tracking-wider text-sm mb-4 font-sans">
                Co-Principal Investigator
              </p>
              <p className="text-[var(--color-text-secondary)] font-sans">
                Girijananda Chowdhury University, Assam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Website Developers Section */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] font-medium mb-4">
              Website Developers
            </h2>
            <div className="w-12 h-0.5 bg-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto font-sans">
              A group of CSE students from Girijananda Chowdhury University driven by a shared passion for cultural conservation and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Ritanjit Das',
                initials: 'RD',
                message: 'Bringing innovative solutions, one step at a time.'
              },
              {
                name: 'Sandilya Baruah',
                initials: 'SB',
                message: 'A journey of a thousand miles begins with a single step – and a few lines of code.'
              },
              {
                name: 'Subhrajyoti Goswami',
                initials: 'SG',
                message: 'Tech and creativity – a perfect blend for the future.'
              }
            ].map((member, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-elevated)] rounded-xl p-8 border border-[var(--color-border)] text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Initials Avatar */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-bg)] flex items-center justify-center">
                  <span className="font-display text-3xl text-[var(--color-primary)]">{member.initials}</span>
                </div>
                <h3 className="font-display text-2xl text-[var(--color-text)] font-medium mb-2">
                  {member.name}
                </h3>
                <p className="mt-4 bg-[var(--color-surface-soft)] p-3 rounded-lg text-[var(--color-text-secondary)] italic text-sm font-sans">
                  "{member.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-0.5 bg-[var(--color-primary)]" />
    </div>
  );
}
