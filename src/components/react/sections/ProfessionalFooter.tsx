import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export default function ProfessionalFooter() {
  return (
    <footer className="bg-[#181715] pt-16 pb-16 md:pb-8 px-6 relative">
      {/* Arabesque texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/white-diamond.png')",
          opacity: 0.15,
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Column 1 - Logo & Description */}
          <div className="text-center sm:text-left">
            <div className="w-20 h-20 mb-4 rounded-full bg-[#cc785c] flex items-center justify-center mx-auto sm:mx-0">
              <img src="/assets/logo/logo.png" alt="Assamese Manuscript Archive Logo" className="h-18 w-18 rounded-full object-cover" />
            </div>
            <h3 className="font-display text-xl text-[#faf9f5] font-medium mb-3">
              Assamese Manuscript Archive
            </h3>
            <p className="text-xs text-[#a09d96] leading-relaxed mb-4">
              Preserving ancient Vaishnavite illuminated manuscripts, Sanchipat folios, and Samaguri Satra's mask-making traditions in Majuli, Assam.
            </p>
            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <a
                href="https://www.instagram.com/gcu_assam/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#cc785c] text-white flex items-center justify-center transition-colors"
                aria-label="Follow GCU Assam on Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/gcuniversityassam/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#cc785c] text-white flex items-center justify-center transition-colors"
                aria-label="Follow GC University Assam on Facebook"
              >
                <FaFacebook size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 - Explorations & Resources */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-[#cc785c] mb-4">
              Explore Archive
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/collections" className="text-white hover:text-[#cc785c] transition-colors">
                  Manuscript Collections
                </a>
              </li>
              <li>
                <a href="/picture-gallery" className="text-white hover:text-[#cc785c] transition-colors">
                  Picture Gallery
                </a>
              </li>
              <li>
                <a href="/knowMore" className="text-white hover:text-[#cc785c] transition-colors">
                  Heritage Articles &amp; History
                </a>
              </li>
              <li>
                <a href="/audioplayer" className="text-white hover:text-[#cc785c] transition-colors">
                  Audio Guides
                </a>
              </li>
              <li>
                <a href="/resources" className="text-white hover:text-[#cc785c] transition-colors">
                  Research Resources
                </a>
              </li>
              <li>
                <a href="/news" className="text-white hover:text-[#cc785c] transition-colors">
                  Latest News &amp; Updates
                </a>
              </li>
              <li>
                <a href="/team" className="text-white hover:text-[#cc785c] transition-colors">
                  Project Team &amp; Leadership
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Us & Hours */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-[#cc785c] mb-4">
              Visit &amp; Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start justify-center sm:justify-start gap-2 text-white">
                <MapPin size={18} className="text-[#cc785c] flex-shrink-0 mt-0.5" />
                <span>Samaguri Satra, Kaliabor / Majuli, Assam, India</span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 text-white hover:text-[#cc785c] transition-colors"
                >
                  <Phone size={16} className="text-[#cc785c]" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@assammanuscriptarchive.com"
                  className="inline-flex items-center gap-2 text-white hover:text-[#cc785c] transition-colors"
                >
                  <Mail size={16} className="text-[#cc785c]" />
                  <span>info@assammanuscriptarchive.com</span>
                </a>
              </li>
              <li className="pt-2 text-xs text-[#a09d96]">
                <strong className="text-white">Hours:</strong> 07:00 AM – 05:00 PM (Mon–Sun)<br />
                <strong className="text-white">Admission:</strong> Free (Donations welcome)
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal & Policies */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-[#cc785c] mb-4">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <a href="/privacy" className="text-white hover:text-[#cc785c] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-white hover:text-[#cc785c] transition-colors">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-white hover:text-[#cc785c] transition-colors">
                  Institutional Disclaimer
                </a>
              </li>
              <li>
                <a href="/copyright" className="text-white hover:text-[#cc785c] transition-colors">
                  Copyright &amp; Citations
                </a>
              </li>
            </ul>

            {/* Quick Map Link */}
            <a
              href="https://maps.google.com/?q=Samaguri+Satra+Kaliabor+Assam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#faf9f5] border border-white/10 transition-colors"
            >
              <MapPin size={12} className="text-[#cc785c]" />
              <span>Open in Google Maps</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8" />

        {/* Bottom Section - Copyright */}
        <div className="text-center">
          <p className="text-sm text-[#a09d96]">
            © {new Date().getFullYear()} Assamese Manuscript Archive &amp; Samaguri Satra. Supported by ASTEC under the ITGA scheme.
          </p>
          <p className="text-xs text-[#8e8b82] mt-2">
            In collaboration with Girijananda Chowdhury University, Assam
          </p>
        </div>
      </div>
    </footer>
  );
}