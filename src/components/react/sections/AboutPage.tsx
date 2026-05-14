import React from 'react';
import { BookOpen, Users, Building2, Target, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-text)] font-medium mb-6 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
            About Us
          </h1>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
            <svg className="w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
          </div>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Discover the initiative dedicated to preserving and sharing Assam's Vaishnavite manuscript heritage through digital innovation.
          </p>
        </div>
      </section>

      {/* Project Overview Section - Coral Callout */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Globe size={16} className="text-white" />
              <span className="text-white/90 text-sm font-medium uppercase tracking-wider">ITGA Funded Project</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-white font-medium mb-6">
              Journey Through Assam's Vaishnavite Manuscript Paintings
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-display italic">
              Bridging Heritage and Tourism with Digital Innovation
            </p>
          </div>
        </div>
      </section>

      {/* Funding & Collaboration Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Funding Card */}
            <div className="bg-[var(--color-bg-elevated)] rounded-xl p-8 md:p-12 border border-[var(--color-border)]">
              <div className="w-14 h-14 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-[var(--color-text)] font-medium mb-4">
                Funding Authority
              </h3>
              <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-4">
                This initiative is part of the project funded under the <span className="text-[var(--color-primary)] font-medium">Innovation, Technology Generation and Awareness (ITGA)</span> scheme of the Assam Science Technology and Environment Council (ASTEC).
              </p>
            </div>

            {/* Collaboration Card */}
            <div className="bg-[var(--color-bg-elevated)] rounded-xl p-8 md:p-12 border border-[var(--color-border)]">
              <div className="w-14 h-14 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-[var(--color-text)] font-medium mb-4">
                Key Collaborators
              </h3>
              <div className="space-y-4 text-[var(--color-text-secondary)] text-lg leading-relaxed">
                <p className="flex items-start gap-3">
                  <Building2 size={20} className="mt-1 text-[var(--color-primary)] flex-shrink-0" />
                  <span><strong className="text-[var(--color-text)]">Girijananda Chowdhury University, Assam</strong> — Academic and institutional support</span>
                </p>
                <p className="flex items-start gap-3">
                  <Building2 size={20} className="mt-1 text-[var(--color-primary)] flex-shrink-0" />
                  <span><strong className="text-[var(--color-text)]">Chamaguri Sattra (Samaguri Sattra), Majuli</strong> — Custodian of heritage traditions</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Description Section - Dark Surface */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-surface-dark)]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
              <h3 className="font-display text-2xl md:text-3xl text-[var(--color-on-dark)] font-medium">
                Project Mission
              </h3>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-on-dark-soft)]">
              <p>
                The project is dedicated to the <span className="text-[var(--color-primary)] font-medium">documentation and digital preservation</span> of Vaishnavite manuscript painting traditions.
              </p>
              <p>
                It seeks to make these cultural resources more accessible by linking manuscripts preserved at the Sattra museum with a digital platform through QR codes, providing visitors with curated information, contextual descriptions, and selected visual excerpts, enabling a more informed and engaging experience of this heritage.
              </p>
              <p>
                The collaboration is grounded in a commitment to <span className="text-[var(--color-primary)] font-medium">ethical documentation and cultural respect</span>, ensuring that all materials are developed in consultation with the custodians of the Sattra tradition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] font-medium mb-4">
              Project Leadership
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
              Led by distinguished academics from Girijananda Chowdhury University
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Dr. Nilakshi Goswami */}
            <div className="bg-[var(--color-bg-elevated)] rounded-xl p-8 border border-[var(--color-border)] text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-surface-dark)] flex items-center justify-center">
                <span className="font-display text-3xl text-[var(--color-primary)]">NG</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--color-text)] font-medium mb-2">
                Dr. Nilakshi Goswami
              </h3>
              <p className="text-[var(--color-primary)] font-medium uppercase tracking-wider text-sm mb-4">
                Principal Coordinator
              </p>
              <p className="text-[var(--color-text-secondary)]">
                Girijananda Chowdhury University, Assam
              </p>
            </div>

            {/* Dr. Shrabani Medhi */}
            <div className="bg-[var(--color-bg-elevated)] rounded-xl p-8 border border-[var(--color-border)] text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-surface-dark)] flex items-center justify-center">
                <span className="font-display text-3xl text-[var(--color-primary)]">SM</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--color-text)] font-medium mb-2">
                Dr. Shrabani Medhi
              </h3>
              <p className="text-[var(--color-primary)] font-medium uppercase tracking-wider text-sm mb-4">
                Co-Principal Investigator
              </p>
              <p className="text-[var(--color-text-secondary)]">
                Girijananda Chowdhury University, Assam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Goals & Impact Section */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-surface-soft)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] font-medium mb-4">
              Our Goals
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
              Creating meaningful connections between heritage preservation, education, and cultural tourism
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Heritage Preservation */}
            <div className="bg-[var(--color-bg)] rounded-xl p-8 border border-[var(--color-border)]">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-xl text-[var(--color-text)] font-medium mb-3">
                Heritage Preservation
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Documenting and digitally preserving Vaishnavite manuscript painting traditions for future generations.
              </p>
            </div>

            {/* Education */}
            <div className="bg-[var(--color-bg)] rounded-xl p-8 border border-[var(--color-border)]">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-xl text-[var(--color-text)] font-medium mb-3">
                Education
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Providing accessible educational resources about Assamese culture, art, and heritage to audiences worldwide.
              </p>
            </div>

            {/* Cultural Tourism */}
            <div className="bg-[var(--color-bg)] rounded-xl p-8 border border-[var(--color-border)]">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-xl text-[var(--color-text)] font-medium mb-3">
                Cultural Tourism
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Creating meaningful connections between heritage sites and visitors through innovative digital experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-surface-dark)]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
              <svg className="w-6 h-6 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-on-dark)] font-medium mb-6">
              Foregrounding the Living Legacy
            </h2>
            <p className="text-lg md:text-xl text-[var(--color-on-dark-soft)] leading-relaxed">
              This initiative aims to create meaningful connections while foregrounding the living legacy of Assam's Vaishnavite manuscript traditions.
            </p>
          </div>
        </div>
      </section>

      {/* Website Developers Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] font-medium mb-4">
              Website Developers
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
              A group of CSE students from Girijananda Chowdhury University driven by a shared passion for art and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Ritanjit Das',
                initials: 'RD',
                roll: '42',
                link: 'https://www.linkedin.com/in/ritanjit-das-530b7b216',
                message: 'Bringing innovative solutions, one step at a time.'
              },
              {
                name: 'Sandilya Baruah',
                initials: 'SB',
                roll: '45',
                link: 'https://www.linkedin.com/in/sandilya-baruah-40973a212',
                message: 'A journey of a thousand miles begins with a single step – and a few lines of code.'
              },
              {
                name: 'Subhrajyoti Goswami',
                initials: 'SG',
                roll: '49',
                link: 'https://www.linkedin.com/in/subhrajyoti-goswami-6b28a7250',
                message: 'Tech and creativity – a perfect blend for the future.'
              }
            ].map((member, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-elevated)] rounded-xl p-8 border border-[var(--color-border)] text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Initials Avatar */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-surface-dark)] flex items-center justify-center">
                  <span className="font-display text-3xl text-[var(--color-primary)]">{member.initials}</span>
                </div>
                <h3 className="font-display text-2xl text-[var(--color-text)] font-medium mb-2">
                  {member.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Computer Science & Engineering</p>
                <p className="text-sm text-[var(--color-text-muted)]">Roll No: {member.roll}</p>
                <div className="flex justify-center mt-3">
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:opacity-80 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                </div>
                <p className="mt-4 bg-[var(--color-surface-soft)] p-3 rounded-lg text-[var(--color-text-secondary)] italic text-sm">
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