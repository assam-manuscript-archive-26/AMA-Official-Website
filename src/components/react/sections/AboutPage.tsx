import React from 'react';
import { BookOpen, Users, Building2, Target, Award, Globe, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page text-[var(--color-text)] min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-text)] font-medium mb-6 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
            About the Assamese Manuscript Archive Project
          </h1>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
            <svg className="w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
          </div>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Preserving Assam’s sacred Vaishnavite manuscript paintings and Samaguri Satra's living cultural traditions through digital documentation, academic rigor, and community engagement.
          </p>
        </div>
      </section>

      {/* Project Overview Section - Coral Callout */}
      <section className="py-10 px-6 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
              <Globe size={18} className="text-white" />
              <span className="text-white text-sm font-medium tracking-wide">Government Grant Under ITGA Scheme</span>
            </div>
            <p className="text-xl md:text-2xl text-white font-display leading-relaxed">
              “Journey Through Assam’s Vaishnavite Manuscript Paintings: Bridging Heritage and Tourism with Digital Innovation,” funded under the Innovation, Technology Generation and Awareness (ITGA) scheme of the Assam Science Technology and Environment Council (ASTEC).
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Collaboration & Mission */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text)]">
            <p>
              The project is a pioneering institutional partnership between <span className="text-[var(--color-primary)] font-semibold">Girijananda Chowdhury University (GCU), Assam</span>, and the revered <span className="text-[var(--color-primary)] font-semibold">Chamaguri Sattra (Samaguri Satra), Majuli</span>. The initiative is dedicated to the systematic documentation, high-resolution digitization, and scholarly preservation of Assam's centuries-old Vaishnavite manuscript painting traditions.
            </p>
            <p>
              By directly linking physical manuscripts and mask-making artifacts preserved at the Samaguri Satra museum with an accessible digital portal through interactive QR codes, the project enables tourists, students, and scholars from across the globe to access curated historical context, high-resolution folios, and multilingual audio guides in <strong className="text-[var(--color-primary)]">English, Assamese (অসমীয়া), and Hindi</strong>.
            </p>
          </div>

          {/* Key Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-[var(--color-ink)]">
                Digital Preservation
              </h3>
              <p className="text-[var(--color-body)] text-sm leading-relaxed">
                Documenting fragile Sanchipat folios, ancient vegetable-mineral dyes, and historical calligraphy before physical deterioration from environmental factors.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-[var(--color-ink)]">
                Living Mask Heritage
              </h3>
              <p className="text-[var(--color-body)] text-sm leading-relaxed">
                Celebrating Mukha Shilpa—the Bhaona mask-making art nurtured at Samaguri Satra, led by master custodian and Padma Shri recipient Hem Chandra Goswami.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-[var(--color-ink)]">
                Scholarly Access &amp; Tourism
              </h3>
              <p className="text-[var(--color-body)] text-sm leading-relaxed">
                Bridging academic research with responsible cultural tourism through trilingual narration, QR tour stations, and open-access research materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Leadership Section */}
      <section className="py-16 md:py-20 px-6 bg-[var(--color-bg-elevated)] border-t border-b border-[var(--color-hairline)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] font-semibold mb-6">
            Project Leadership &amp; Custodianship
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8">
            The initiative is led by <strong className="text-[var(--color-primary)]">Dr. Nilakshi Goswami</strong> (Principal Coordinator) with <strong className="text-[var(--color-primary)]">Dr. Shrabani Medhi</strong> (Co-Principal Investigator), conducted with the academic stewardship of Girijananda Chowdhury University and the active guidance of the cultural elders of Samaguri Satra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/team"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] transition-all font-medium shadow-md"
            >
              Meet the Research Team
            </a>
            <a
              href="/visit"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[var(--color-ink)] bg-[var(--color-surface-soft)] hover:bg-[var(--color-hairline)] border border-[var(--color-hairline)] transition-all font-medium"
            >
              Visit Samaguri Satra
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}