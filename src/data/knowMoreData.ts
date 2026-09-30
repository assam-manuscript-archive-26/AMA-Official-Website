export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: ArticleSection[];
  ctaText: string;
  ctaHref: string;
}

export const articles: Article[] = [
  {
    id: "majuli-assamese-manuscripts",
    title: "Know More About Majuli and Assamese Manuscripts",
    excerpt:
      "Discover the rich history of Majuli, Sattras, and the timeless tradition of Assamese manuscript preservation.",
    category: "Heritage",
    content: [
      {
        paragraphs: [
          "Majuli, situated on the Brahmaputra River in Assam, is widely recognized as a cultural and spiritual center of the region. Home to numerous Sattras established through the neo-Vaishnavite movement of Srimanta Sankardeva and Madhavdeva, Majuli has long served as a space for religious learning, artistic practice, and manuscript preservation. These monastic institutions nurtured traditions of devotional literature, music, theatre, and visual art that continue to shape Assamese cultural identity.",
          "Assamese manuscripts form an important part of this heritage. Carefully handwritten on traditional materials such as sanchipat and tulapat, these texts preserve religious teachings, philosophical reflections, biographies, poetry, and adaptations of epic narratives. Many manuscripts were created and maintained within Sattras, where they functioned not only as literary records but also as living instruments of devotion, performance, and education.",
          "Together, Majuli and Assamese manuscripts represent a shared legacy of cultural memory, where text, art, and spirituality intersect. Exploring these traditions offers insight into Assam's rich intellectual history and the communities that continue to sustain it.",
        ],
      },
      {
        heading: "Sattras and Vaishnavite Traditions",
        paragraphs: [
          "The Sattras of Assam are monastic institutions established through the neo-Vaishnavite movement initiated by Srimanta Sankardeva and later expanded by Madhavdeva. These institutions function as centres of religious practice, learning, and cultural life, where devotion to Krishna is expressed through collective worship, music, dance, and literary traditions. Sattras have played a foundational role in preserving Assamese cultural identity, nurturing both spiritual and artistic practices that continue to be transmitted across generations.",
        ],
      },
      {
        heading: "Assamese Manuscripts (History and Heritage)",
        paragraphs: [
          "Assamese manuscripts represent a long-standing tradition of literary and religious writing that developed within the region's monastic and scholarly environments. Composed and rewritten over centuries, these texts include devotional poetry, religious narratives, biographies of saints, philosophical discourses, and adaptations of epic traditions. Written in Assamese and related script forms on materials such as sanchipat and tulapat, they offer valuable insight into the intellectual, religious, and cultural history of Assam.",
        ],
      },
      {
        heading: "Manuscript Painting Traditions",
        paragraphs: [
          "Manuscript painting in Assam is closely associated with the Sattra tradition, where visual and textual cultures developed in tandem. These paintings, often found within illustrated manuscripts, depict scenes from epics, devotional stories, and the lives of Vaishnavite saints. Characterized by vibrant colors, stylized forms, and symbolic imagery, they served both aesthetic and pedagogical purposes, helping to visually communicate religious narratives and moral teachings within monastic communities.",
        ],
      },
      {
        heading: "Cultural Significance",
        paragraphs: [
          "Together, Assamese manuscripts and manuscript paintings constitute a vital part of the region's cultural memory. They reflect the interwoven nature of text, image, and devotion in Assamese society, where literature and visual art functioned as mediums of spiritual expression and collective identity. Today, these traditions continue to hold significance not only as historical artifacts but also as living cultural practices that connect contemporary communities to their intellectual and religious heritage.",
        ],
      },
    ],
    ctaText: "Explore Our Collections",
    ctaHref: "/collections",
  },
  {
    id: "mask-making-samaguri-sattra",
    title: "The Art of Mask Making at Samaguri Sattra",
    excerpt:
      "Explore the mask-making tradition of Samaguri Sattra, an art form rooted in Neo-Vaishnavite heritage.",
    category: "Art & Craft",
    content: [
      {
        paragraphs: [
          "The mask-making tradition of Samaguri Sattra in Majuli, Assam, is one of the most distinctive expressions of Neo-Vaishnavite cultural heritage. Closely associated with the Bhaona performance tradition introduced by Srimanta Sankardeva, these masks serve as powerful visual embodiments of mythological and allegorical characters. Crafted entirely by hand using bamboo, clay, cloth, and natural pigments, they reflect a deeply rooted knowledge system where ritual practice, storytelling, and craftsmanship are closely intertwined.",
          "Within this living tradition, Padmashree Hem Chandra Goswami stands as one of its most important contemporary custodians. A master artisan from Samaguri Sattra, he has played a pivotal role in preserving and revitalizing the art of mukha shilpa at a time when many such indigenous practices faced decline. Drawing from generational knowledge inherited within the sattra, he has continued to sustain the core aesthetic and ritual principles of mask-making while also ensuring its relevance in changing cultural contexts.",
          "His contribution extends beyond preservation to thoughtful innovation. Goswami is known for refining the structural design of masks by making them lighter, more durable, and performance-friendly, without compromising their symbolic depth. He has also helped expand the expressive possibilities of the masks, enabling more dynamic use in Bhaona performances. Through workshops, demonstrations, and cultural exchanges across India and abroad, he has brought wider visibility to this tradition, positioning Samaguri Sattra as a key site of living heritage.",
          "In recognition of his contribution to Indian arts and crafts, he was awarded the Padma Shri in 2023. His work continues to ensure that the mask-making tradition of Samaguri Sattra remains not only preserved but actively practiced, evolving as a vibrant form of cultural expression rooted in devotion and performance.",
        ],
      },
    ],
    ctaText: "Explore Our Collections",
    ctaHref: "/collections",
  },
  {
    id: "sanchipat-manuscript-tradition",
    title: "The Tradition of Sanchipat and Tulapat Manuscripts in Assam",
    excerpt:
      "Understand the indigenous techniques behind Sanchipat bark processing, mineral inks, and centuries-old manuscript preservation in Assam.",
    category: "History & Conservation",
    content: [
      {
        heading: "The Botanical Origin of Sanchipat",
        paragraphs: [
          "In ancient Assam, the primary medium for recording scriptures, royal chronicles (Buranji), philosophical treatises, and illuminated paintings was Sanchipat. Sanchipat is prepared from the bark of the Sanchi tree, scientifically known as Aquilaria agallocha (the agarwood tree). Indigenous to the tropical riverine forests of the Brahmaputra valley, the bark of mature trees possesses unique fibrous toughness and natural resin content that makes it remarkably resilient against decay.",
          "Unlike palm-leaf (talapatra) traditions dominant in southern and eastern India, Sanchipat sheets offer an exceptionally smooth, pliable, and non-brittle writing surface. When properly prepared and cured, Sanchipat folios remain preserved for over six to eight centuries even in Assam's humid monsoon climate.",
        ],
      },
      {
        heading: "Traditional Preparation and Curing Techniques",
        paragraphs: [
          "The indigenous preparation process required meticulous craftsmanship across several weeks. Long strips of bark were carefully extracted from trees aged between fifteen and thirty years, ensuring the inner wood was unharmed. The outer rough epidermis was peeled away, followed by an extended period of curing where the bark strips were soaked in dew or running river water and dried under controlled shade.",
          "To achieve a smooth writing surface, artisans rubbed the cured sheets with burnt brick powder, followed by the seeds of Phaseolus mungo (Mati-mah). Finally, a fine application of arsenic trisulphide (haitaal) was applied, imparting a lustrous yellow hue that acted as a potent natural biocide against woodborers, termites, and fungal degradation.",
        ],
      },
      {
        heading: "Traditional Inks and Natural Pigments",
        paragraphs: [
          "Texts inscribed upon Sanchipat were executed using a specialized, indelible Assamese ink known as Mahi. Prepared from an ancient recipe incorporating silikha (Terminalia chebula), cow urine, rust scrapings from iron vessels, and carbon soot collected from mustard-oil lamps, Mahi formed a chemical bond with the bark fibers that remains pitch-black and waterproof through centuries.",
          "Illuminated manuscripts combined this durable ink with mineral and vegetable dyes such as hengul (cinnabar red), haitaal (orpiment yellow), indigo blue (neel), and chalk white (dhala mati), creating the vivid narrative tableaus preserved within Samaguri Satra and monasteries across Assam today.",
        ],
      },
    ],
    ctaText: "View Manuscript Gallery",
    ctaHref: "/picture-gallery",
  },

];

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}
