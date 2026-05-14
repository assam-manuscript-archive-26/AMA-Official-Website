import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

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
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#cc785c] flex items-center justify-center">
              <span className="text-white font-display text-3xl">স</span>
            </div>
            <h3 className="font-display text-xl text-[#faf9f5] font-medium mb-3">
              Assamese Manuscript Archive
            </h3>
            <p className="text-sm text-[#a09d96] max-w-lg mx-auto leading-relaxed">
              Preserving the rich cultural heritage of Assam through digitally.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="text-center">
            <h4 className="text-base font-semibold text-[#cc785c] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-white hover:text-[#cc785c] transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="text-white hover:text-[#cc785c] transition-colors text-sm"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-white hover:text-[#cc785c] transition-colors text-sm"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/copyright"
                  className="text-white hover:text-[#cc785c] transition-colors text-sm"
                >
                  Copyright Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Us */}
          <div className="text-center">
            <h4 className="text-base font-semibold text-[#cc785c] mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center gap-2 text-white text-sm">
                <MapPin size={16} className="text-[#cc785c]" />
                <span>Assamese Manuscript Archive, Majuli, Assam, India</span>
              </li>
              <li>
                <a
                  href="tel:+919999999999"
                  className="inline-flex items-center gap-2 text-white hover:text-[#cc785c] transition-colors text-sm"
                >
                  <Phone size={16} className="text-[#cc785c]" />
                  <span>+91 99999 99999</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:assamesemanuscriptarchive@gmail.com"
                  className="inline-flex items-center gap-2 text-white hover:text-[#cc785c] transition-colors text-sm"
                >
                  <Mail size={16} className="text-[#cc785c]" />
                  <span>assamesemanuscriptarchive@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Find Us */}
          <div className="text-center">
            <h4 className="text-base font-semibold text-[#cc785c] mb-4">
              Find Us
            </h4>
            {/* Map Placeholder */}
            <div className="w-full h-32 bg-[#252320] rounded-lg flex items-center justify-center border border-[#1f1e1b]">
              <div className="text-center">
                <MapPin size={24} className="mx-auto text-[#cc785c] mb-2" />
                <p className="text-xs text-[#a09d96]">Assamese Manuscript Archive</p>
                <p className="text-xs text-[#a09d96]">Majuli, Assam</p>
                <a
                  href="https://maps.google.com/?q=Assamese Manuscript Archive+Majuli+Assam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#cc785c] hover:text-[#faf9f5] mt-2 transition-colors"
                >
                  Open in Maps
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8" />

        {/* Bottom Section - Copyright */}
        <div className="text-center">
          <p className="text-sm text-[#a09d96]">
            © {new Date().getFullYear()} Assamese Manuscript Archive. All rights reserved.
          </p>
          <p className="text-xs text-[#8e8b82] mt-2">
            Crafted with love for preserving Assamese heritage :)
          </p>
        </div>
      </div>
    </footer>
  );
}