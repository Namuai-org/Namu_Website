/**
 * Blog content.
 *
 * Posts live here rather than in the page so the index and the `/blog/[slug]`
 * detail route read from one source. Swapping this for a CMS later means
 * replacing `posts` with a fetch — the shapes below are what both pages expect.
 */

export type PostCategory = "Product" | "Research" | "Story" | "Press";

export type Post = {
  slug: string;
  title: string;
  /** One or two sentences. Used on cards and as the page description. */
  excerpt: string;
  category: PostCategory;
  /** ISO date — sorting reads this, never the display string. */
  date: string;
  readTime: string;
  author: string;
  image: string;
  imageAlt: string;
  /** Body paragraphs. Plain strings; a subheading is any entry ending in ":". */
  body: string[];
};

export const CATEGORIES: PostCategory[] = [
  "Product",
  "Research",
  "Story",
  "Press",
];

export const posts: Post[] = [
  {
    slug: "shipping-hausa-writing-tools",
    title: "Shipping writing tools that sound natural in Hausa",
    excerpt:
      "Translation gets you words. It does not get you register, proverb, or the way a sentence is actually built. Here is what we changed.",
    category: "Product",
    date: "2025-10-12",
    readTime: "4 min read",
    author: "Mouhamad Mamane",
    image: "/editorial/canyon-ochre-wide.jpg",
    imageAlt: "Layered sandstone, warm ochre light raking across the folds",
    body: [
      "The first version of our writing tools worked the way most multilingual products work. A model trained largely on English produced a draft, and a translation layer moved it into Hausa. The output was grammatical. It was also, to every Hausa speaker who tried it, obviously not written by one.",
      "What translation loses:",
      "Register is the first casualty. Hausa carries formality in ways that do not survive a word-level mapping — the difference between how you address an elder, a colleague and a child is not a synonym swap. A translated sentence lands in a register nobody chose.",
      "Proverb and idiom are the second. They are not decoration. They carry argument. A paragraph that would naturally rest on a known saying instead spells the idea out longhand, and reads as though it is explaining something obvious.",
      "Then there is sentence construction itself. Hausa builds emphasis differently. Translation preserves meaning while quietly discarding the shape that made the meaning land.",
      "What we changed:",
      "We stopped treating Hausa as a destination and started treating it as the starting point. Prompts are interpreted in Hausa. Drafts are generated in Hausa. Nothing round-trips through English on the way.",
      "That is a harder engineering problem and a much better product. It is also why the data work matters as much as the model work — you cannot generate a register you have never seen.",
    ],
  },
  {
    slug: "why-we-started-this",
    title: "Why we started this",
    excerpt:
      "A farmer asked a question in Hausa and got an answer in French, citing the wrong legal code. That is the whole problem in one exchange.",
    category: "Story",
    date: "2025-10-04",
    readTime: "3 min read",
    author: "Mouhamad Mamane",
    image: "/editorial/paint-sea-dusk.jpg",
    imageAlt: "A painted horizon at dusk, sun low over still water",
    body: [
      "Someone we know farms millet outside Tahoua. He had a question about a water dispute in his village — the kind of question where the answer depends entirely on which rule applies and who administers it.",
      "He asked in Hausa. He got an answer in French, citing a legal code from the wrong country.",
      "It is easy to file that under amusing model failure. It is not. He asked a real question, in the language he thinks in, and the system he reached was not built with him in mind at any point in its construction. Not in the data it learned from, not in the benchmarks it was measured against, not in the interface he typed into.",
      "The gap is not talent:",
      "More than seventy million people speak Hausa. The language has centuries of written scholarship. What it does not have is presence in the datasets, models and tools that define what modern AI can do.",
      "That absence compounds. No data means weak models. Weak models mean no usable tools. No tools mean no usage — and no usage means no new data. The loop closes on itself, and it stays closed until someone deliberately breaks it.",
      "That is what Namu is for. Not a translation layer over someone else's system. Infrastructure built from the language outward.",
    ],
  },
  {
    slug: "collecting-speech-with-consent",
    title: "Collecting speech data with consent, not extraction",
    excerpt:
      "The fastest way to build a speech corpus is to take one. We are not doing that, and the reasons are practical as much as ethical.",
    category: "Research",
    date: "2025-09-19",
    readTime: "5 min read",
    author: "Mouhamad Mamane",
    image: "/editorial/desert-aerial-rose.jpg",
    imageAlt: "Desert seen from above, rust and rose dunes reaching across the frame",
    body: [
      "There is a well-worn path for assembling a speech corpus quickly: scrape broadcast archives, lift audio from video platforms, buy a dataset whose provenance nobody documents. It is fast, it is cheap, and it is how a great deal of what exists today was built.",
      "We are not doing that, and not only for the reason you would expect.",
      "The ethical case is straightforward:",
      "People whose voices train a system should know that is happening, agree to it, and be able to change their mind. Communities that have historically been studied rather than served are entitled to more care, not less.",
      "The practical case is the one that convinces engineers:",
      "Scraped audio is broadcast audio. It is news readers, presenters and formal address. It is a register almost nobody speaks in at home, in a market or to a clinician. A model trained on it performs well against a benchmark built from the same source and poorly the moment it meets a real speaker.",
      "Consented collection lets us record what we actually need — conversational speech, code-switching, the dialect spread across Kano and Sokoto and Maradi, the specific vocabulary of farming and health and money. It also lets us document who is represented and who is not, which is the only honest basis for saying what a model can and cannot do.",
      "It is slower. It produces a corpus that is worth more per hour and that we can stand behind when someone asks where it came from.",
    ],
  },
  {
    slug: "starting-with-hausa",
    title: "Starting with Hausa, and what comes after it",
    excerpt:
      "Depth before breadth. One language done properly is worth more than ten done poorly — here is what that means in practice.",
    category: "Research",
    date: "2025-09-08",
    readTime: "4 min read",
    author: "Mouhamad Mamane",
    image: "/editorial/dune-lone-tree.jpg",
    imageAlt: "A single tree against an orange dune, long shadows across the sand",
    body: [
      "The obvious move for an African language AI company is to announce support for as many languages as possible. It reads well and it is largely meaningless, because supporting a language and serving it are different claims.",
      "We are starting with Hausa, and we are going to stay there until the foundation is genuinely solid.",
      "Why one language first:",
      "Everything that makes a language model useful is language-specific and slow to build. Evaluation sets that measure the right things. Dialect coverage that reflects how people actually speak. Domain vocabulary for the sectors where the tool has to work. None of that transfers for free.",
      "Getting it right once also teaches you the method. The second language is faster because you know what to collect, how to evaluate it, and where the failure modes hide — not because the model weights carry over.",
      "What comes after:",
      "Zarma is next, spoken widely along the Niger river in the southwest. Then Fulfulde, which runs in a band across the Sahel from Senegal to Cameroon and has always crossed borders and dialects.",
      "Both are chosen for the same reason Hausa was: large communities, real daily use, and almost nothing built for them.",
    ],
  },
  {
    slug: "language-infrastructure-west-africa",
    title: "Why language infrastructure matters in West Africa",
    excerpt:
      "Not a chatbot. Not a general AI platform. The argument for treating language as infrastructure rather than a feature.",
    category: "Press",
    date: "2025-08-22",
    readTime: "4 min read",
    author: "Mouhamad Mamane",
    image: "/editorial/paint-golden-valley.jpg",
    imageAlt: "A painted valley in golden light, hills receding into haze",
    body: [
      "Infrastructure is the unglamorous layer other things get built on. Roads, power, payment rails. You notice it when it is missing, and what you notice is not the absence itself but everything that cannot happen because of it.",
      "Language is infrastructure in exactly this sense, and across most of West Africa it has not been built.",
      "What sits on top of it:",
      "A clinic that could triage in the language patients speak. A bank that could explain a product without an intermediary. A school with materials in the language its students think in. A government service that does not require a translator to access.",
      "None of those are AI products. They are ordinary services that become possible once the layer beneath them exists.",
      "Why it has to be built deliberately:",
      "The market will not produce this on its own, because the returns accrue to everyone and the cost falls on whoever moves first. That is the standard shape of an infrastructure problem, and the standard answer is that someone has to decide to build it anyway.",
      "This is why we describe Namu as speech-native infrastructure rather than as an assistant. The assistant is one thing you can build on the layer. It is not the layer.",
    ],
  },
  {
    slug: "designing-for-hausa-speakers",
    title: "Designing product experiences for Hausa speakers first",
    excerpt:
      "Designing in one language and localising later bakes in assumptions you cannot remove afterwards. So we stopped doing it.",
    category: "Product",
    date: "2025-08-10",
    readTime: "6 min read",
    author: "Mouhamad Mamane",
    image: "/editorial/panel-canyon-01.jpg",
    imageAlt: "A narrow slot canyon, carved sandstone catching light from above",
    body: [
      "Most products are designed in English and localised afterwards. The process feels neutral. It is not — by the time translation happens, decisions have already been made that no amount of translation can undo.",
      "What gets baked in:",
      "Layout assumes English word length. Hausa is frequently longer, and buttons designed to fit an English label either wrap awkwardly or truncate.",
      "Information hierarchy assumes an English reader's scanning habits, which are learned, not universal.",
      "Empty states, error messages and onboarding — the copy that carries the most tone — get written last and translated fastest, which is precisely backwards.",
      "Designing the other way round:",
      "We write the Hausa first and let the interface accommodate it. Where a label runs long, the component adapts rather than the language being compressed to fit.",
      "This has a side effect worth naming: it makes the English better too. Copy that has to survive being written in Hausa first tends to be plainer and less idiomatic, which travels further.",
      "None of this is expensive. It is almost entirely a question of what order you do things in.",
    ],
  },
];

/** Newest first. */
export const postsByDate = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
