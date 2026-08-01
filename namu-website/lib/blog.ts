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
    slug: "why-does-voice-technology-matter",
    title: "Why Does Voice technology matter?",
    excerpt:
      "One evening in Niamey, the electricity went out while my family was sitting together outside.",
    category: "Story",
    date: "2025-10-12",
    readTime: "5 min read",
    author: "Mouhamad Mamane",
    image: "/editorial/panel-children-dusk.jpg",
    imageAlt: "Children standing together outside in low golden light",
    body: [
      "One evening in Niamey, the electricity went out while my family was sitting together outside.",
      "The house went dark, and the voices coming from nearby homes and the occasional sound of a motorcycle passing through the street became more noticeable. Without a television or our phones to distract us, we began talking.",
      "My uncle was sitting across from me.",
      "I was still young, around ten, I believe. At the age when adults had started asking what I wanted to become in the future. I never knew how to answer that question. I knew the careers I heard most often: doctor, engineer, teacher. Beyond that, I had no clue.",
      "So I asked him casually, “What other kinds of work can someone do?”",
      "“What do you like doing?” he asked.",
      "I told him I liked solving problems. I liked mathematics. I liked taking things apart, understanding how they worked, and sometimes trying to build things myself. I spoke slowly, looking for the right way to explain interests I did not yet know how to name.",
      "I did not need to organize my thoughts perfectly. I could begin with one idea, stop, change my words, and try again. We spoke in the way that came naturally to us, using familiar expressions and examples from the world around us.",
      "He listened and asked more questions.",
      "“Do you like working with people, or do you prefer working alone?”",
      "“What kind of problems do you enjoy?”",
      "“Would you want to create something of your own one day?”",
      "The conversation moved back and forth. He mentioned careers I had never heard of. He explained that some people build machines, some study how systems work, and some create companies around problems they want to solve. When I did not understand something, he gave me an example. When one possibility did not interest me, we moved to another.",
      "By the end of the conversation, I still did not know exactly what I wanted to become. Hopefully, I have a better idea now.",
      "But at that moment, the future felt a little larger.",
      "What made that evening stay with me was not one particular answer my uncle gave. It was the way our conversation helped me discover the question I was really trying to ask.",
      "I did not know the names of the careers I was looking for. I could not have typed them into a search bar. I did not have the vocabulary to write a precise question such as, “What careers combine mathematics, technology, research, and entrepreneurship?”",
      "I only knew how to describe what interested me.",
      "My uncle listened, asked questions, and helped me give shape to something I could not yet express clearly. Our conversation did not depend on my knowing the perfect term or arranging my thoughts into a polished sentence. I could simply speak, and we could work toward the meaning together. That is what conversation can do.",
      "Years later, as I began working with artificial intelligence, I started thinking about moments like that one. That kind of exchange is especially important in communities where much of our fluency lives in speech. Many of us can express detailed ideas, explain complex situations, and ask meaningful questions in our languages, even when we do not regularly read or write them.",
      "That is one of the reasons we chose to focus on voice at Namu.",
      "Across Africa, millions of us speak our languages fluently every day.",
      "We use them to teach, trade, explain, negotiate, raise children, solve problems, and make decisions. We can describe a difficult family situation, explain what is happening to a crop, tell someone how to cross an unfamiliar town, or discuss what we hope to become in the future without ever needing to write those thoughts down.",
      "Yet many of us do not regularly read or write the languages we speak most naturally. Our fluency is primarily oral.",
      "This does not mean we lack language, intelligence, or knowledge. It means that speaking and listening are the ways many of us use our languages most confidently.",
      "Most digital technology, however, has been designed around a different kind of fluency. It expects us to type questions, read instructions, navigate written menus, complete forms, and know how every word is spelled.",
      "That creates a gap. It is part of the reason many African languages are described as “low-resource,” even when they are spoken by millions of people. Hausa, my native language, is spoken by tens of millions of people across West and Central Africa. It is alive in daily conversations, homes, markets, schools, radio programs, and communities. Yet its presence in the datasets used to build modern AI systems remains small compared with languages such as English or French.",
      "When people discuss African languages and artificial intelligence, the conversation often begins with what is unavailable.",
      "There is not enough written content online. There are not enough websites, books, articles, digital documents, or large datasets. Compared with English, French, and other widely represented languages, many African languages have a much smaller written presence on the internet.",
      "That limitation is real. Do not get me wrong, writing matters. It helps preserve knowledge, supports education, makes information searchable, and strengthens the digital presence of a language. We need more written resources in African languages.",
      "But a lack of online text should not be confused with a lack of language. Our languages are already being used constantly. We use them to understand the world and to help one another understand it.",
      "The language is not missing. Most AI systems have simply been built to recognize language mainly when it appears as text.",
      "We could wait for enough text to be written, collected, and digitized. We could ask people to become more comfortable typing their languages, searching with the correct spelling, and navigating text-heavy platforms. Or we could built around how people communicate. Instead of forcing people to adapt to systems built around a different reality, we can build systems that adapt to the ways we already communicate.",
      "That is why voice matters!",
      "At Namu, we are building toward a future where we can speak to intelligent systems as naturally as we speak to someone we trust.",
      "People should not need to become skilled writers or experienced internet users before they can ask a question, receive guidance, or get what they need.",
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
