export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: "What is the Assamese Manuscript Archive?",
    answer: "The Assamese Manuscript Archive is a digital preservation platform developed by Girijananda Chowdhury University (Assam) in collaboration with Samaguri Satra (Majuli), funded by the Assam Science Technology and Environment Council (ASTEC) under the ITGA scheme. The archive preserves ancient Vaishnavite illuminated manuscripts, Sanchipat folios, and monastic artistic traditions through high-resolution imaging, academic transcripts, and multilingual audio guides in English, Assamese, and Hindi."
  },
  {
    question: "What are Sanchipat manuscripts and how were they prepared?",
    answer: "Sanchipat manuscripts are traditional Assamese folios crafted from the bark of the Sanchi tree (Aquilaria agallocha / agarwood). Cured through soaking, polished with brick dust and seeds, and treated with haitaal (arsenic trisulphide) for biological preservation, Sanchipat sheets provided an insect-proof, resilient surface that has survived for over six centuries in Assam's humid climate. Texts and illustrations were executed using indelible Mahi ink and natural mineral pigments."
  },
  {
    question: "Where is Samaguri Satra located and how can visitors reach it?",
    answer: "Samaguri Satra (also known as Chamaguri Satra) is located in Majuli, Assam, India. To visit, travelers take a government or private ferry from Nimati Ghat (near Jorhat) across the Brahmaputra River to Kamalabari or Aphalamukh Ghat in Majuli (approximately 1 hour), from where local taxis and auto-rickshaws connect directly to the Satra."
  },
  {
    question: "What is the mask-making tradition (Mukha Shilpa) of Samaguri Satra?",
    answer: "Mukha Shilpa is the centuries-old living heritage of handcrafting dynamic theatrical masks for Bhaona performances, introduced by saint-reformer Srimanta Sankardeva. Artisans construct anatomical frameworks using bamboo (kamee), layered with cotton cloth and Brahmaputra river clay, before hand-painting them with organic mineral dyes. Master artisan Padma Shri Hem Chandra Goswami is celebrated globally for preserving and innovating this craft."
  },
  {
    question: "What are the visiting hours and entry fees for Samaguri Satra?",
    answer: "Samaguri Satra is open to visitors and researchers from 07:00 AM to 05:00 PM, Monday through Sunday. Admission is free. Visitors may make voluntary donations or purchase traditional handcrafted masks to support the monastic artisans directly."
  }
];

export const faqSchema = {
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};
