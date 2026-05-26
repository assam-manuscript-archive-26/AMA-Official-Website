import React from 'react';
import { BookOpen, Users, Building2, Target, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page text-[var(--color-text)] min-h-screen ">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-text)] font-medium mb-6 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
            About Us
          </h1>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
            <svg className="w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div className="h-px w-16 md:w-24 bg-[var(--color-primary)]" />
          </div>
          {/* <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Learn more about our project and mission
          </p> */}
        </div>
      </section>

      {/* Project Overview Section - Coral Callout */}
      <section className="py-8 px-6 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Globe size={16} className="text-white" />
              <span className="text-white/90 text-sm font-medium uppercase tracking-wider">ITGA & ASTEC Funded Project</span>
            </div> */}
            {/* <h2 className="font-display text-3xl md:text-5xl text-white font-medium mb-6">
              Journey Through Assam's Vaishnavite Manuscript Paintings
            </h2> */}
            <p className="text-xl md:text-2xl text-white font-display">
              This initiative is part of the project “Journey Through Assam’s Vaishnavite Manuscript Paintings: Bridging Heritage and Tourism with Digital Innovation,” funded under the Innovation, Technology Generation and Awareness (ITGA) scheme of the Assam Science Technology and Environment Council (ASTEC)
            </p>
          </div>
        </div>
      </section>

      {/* Funding & Collaboration Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text)] text-justify">
            <p>
              The project is a collaboration between <span className="text-[var(--color-primary)] font-medium">Girijananda Chowdhury University, Assam</span>, and <span className="text-[var(--color-primary)] font-medium">Chamaguri Sattra (or Samaguri Sattra), Majuli</span>, and is dedicated to the documentation and digital preservation of Vaishnavite manuscript painting traditions. It seeks to make these cultural resources more accessible by linking manuscripts preserved at the Sattra museum with a digital platform through QR codes, providing visitors with curated information, contextual descriptions, and selected visual excerpts, enabling a more informed and engaging experience of this heritage. The initiative is led by <span className='text-[var(--color-primary)] font-medium'>Dr. Nilakshi Goswami</span> (Principal Coordinator) with <span className='text-[var(--color-primary)] font-medium'>Dr. Shrabani Medhi</span> (Co-Principal Investigator), under the academic and institutional support of Girijananda Chowdhury University.
            </p>
            <p>
              The collaboration is grounded in a commitment to ethical documentation and cultural respect, ensuring that all materials are developed in consultation with the custodians of the Sattra tradition. It aims to create meaningful connections between heritage preservation, education, and cultural tourism while foregrounding the living legacy of Assam’s Vaishnavite manuscript traditions
            </p>
          </div>
        </div>
      </section>

      {/* Goals & Impact Section */}
      <section className="py-16 md:py-24 px-6">
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
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] font-medium mb-6">
              Our Team
            </h2>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed mb-10">
              Meet the individuals behind the Assamese Manuscript Archive project
            </p>
            <a
              href="/team"
              className="flex w-fit mx-auto items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-[var(--color-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] transition-all duration-200 shadow-md font-sans"
            >
              View Team Members
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-0.5 bg-[var(--color-primary)]" />
    </div>
  );
}