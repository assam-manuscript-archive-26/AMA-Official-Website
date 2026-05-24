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
          "Together, Assamese manuscripts and manuscript paintings constitute a vital part of the region's cultural memory. They reflect the interwoven nature of text, image, and devotion in Assamese society, where literature and visual art functioned as mediums of spiritual expression and collective identity. Today, these traditions continue to hold significance not only as historical artifacts but also as living cultural practices that connect contemporary communities to their intellectual and religious heritage.",
        ],
      },
    ],
    ctaText: "Explore Our Collections",
    ctaHref: "/collections",
  },
  {
    id: "demo-article-3",
    title: "Lorem Ipsum",
    excerpt:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    category: "demo-article",
    content: [
      {
        paragraphs: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, tristique interdum massa quis, tempus venenatis arcu. Mauris a nunc nisl. Vestibulum neque sem, aliquam sit amet vulputate quis, pretium a tellus. In quis leo eget leo tristique molestie non at lectus. Sed id placerat erat. Duis vehicula tortor sit amet tellus varius, id tristique orci commodo. Maecenas sodales orci quis est condimentum, et mattis tortor convallis. In imperdiet mi ut nulla iaculis, in tristique tellus dictum.",
          "In tincidunt, leo at dictum hendrerit, lorem enim auctor nunc, ut sodales leo ipsum vel sapien. Suspendisse volutpat tellus nec lacus posuere, hendrerit varius felis pretium. Sed viverra odio vitae luctus sollicitudin. Donec elementum ultricies felis, at efficitur mauris venenatis et. Integer at nulla sed velit rhoncus suscipit. Nunc iaculis ante nec augue molestie, vitae hendrerit mauris egestas. Integer dictum dignissim posuere. Fusce rutrum turpis in vestibulum posuere. Proin nec sagittis nisi. Nunc malesuada feugiat mauris ac pretium. Donec vel porttitor magna, eget eleifend felis. Nullam ut convallis nisl, vel sollicitudin ligula. Aliquam id placerat arcu. Vivamus in imperdiet purus, in ultricies ligula.",
          "Praesent non ornare nulla. Donec sed rutrum diam, et elementum felis. Suspendisse eros mauris, fringilla ut leo sed, pharetra accumsan massa. Aenean in metus ultricies, ornare risus eu, varius nulla. Suspendisse accumsan, mi ut vulputate commodo, nibh purus porta dolor, in malesuada sem magna nec augue. Nullam vel diam nibh. Donec eget porta dui, ac congue elit.",
          "Aliquam viverra consequat est, sit amet faucibus augue rutrum at. Sed condimentum consectetur tortor. Nullam sem ipsum, porta at sapien consectetur, placerat dapibus enim. Praesent consectetur placerat risus, non vestibulum arcu dignissim ut. Cras et augue augue. Praesent urna ligula, volutpat malesuada feugiat id, cursus sed dui. Quisque id nisl risus. Pellentesque lobortis neque vitae augue lobortis placerat. Nullam non luctus augue. Nam ut nibh at ante elementum dignissim ac sed urna. Vestibulum viverra malesuada porta. Praesent eget porta tortor. Fusce laoreet eleifend ipsum. Maecenas in finibus neque, ac pretium lorem. Sed malesuada dui in vulputate lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        ],
      },
    ],
    ctaText: "Explore Our Collections",
    ctaHref: "/collections",
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}
