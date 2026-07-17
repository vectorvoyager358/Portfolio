export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  why?: string;
  highlights: string[];
  stack: string[];
  github: string;
  live?: string;
  accent: string;
  status?: string;
  metrics?: Array<{ label: string; value: string }>;
};

export type FocusArea = {
  title: string;
  detail: string;
};

export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  summary?: string;
  bullets: string[];
};

export type Education = {
  school: string;
  degree: string;
  dates: string;
  detail?: string;
};

export type CertLogoKey = "anthropic" | "microsoft";

export type Certification = {
  name: string;
  issuer: string;
  url: string;
  year?: string;
  logo: CertLogoKey;
};

export type SkillCluster = {
  id: string;
  label: string;
  items: string[];
};

export type Language = {
  name: string;
  level: string;
  /** Accent styling for native-level fluency. */
  native?: boolean;
};

export const profile = {
  name: "Jeethesh Reddy Gattupalli Singalreddy",
  shortName: "Jeethesh",
  brand: "Jeethesh Reddy",
  title: "Software / AI Engineer",
  personaEmoji: "👋",
  personaAvatar: "/avatar-sm-v9.jpg",
  personaAvatarFull: "/avatar-v9.jpg",
  location: "Houston, Texas",
  email: "vectorvoyager111@gmail.com",
  phone: "(945) 241-9477",
  github: "https://github.com/vectorvoyager358",
  githubHandle: "vectorvoyager358",
  linkedin: "https://www.linkedin.com/in/jeethesh-r-578a421a6",
  summary:
    "Software Engineer building distributed systems, event-driven backend services, and AI-assisted engineering workflows in production. At Halliburton I design and scale Node.js, Kafka, Redis, and WebSocket services that move real-time data reliably — and I ship hands-on AI systems with evaluation, grounding, and operational discipline.",
  heroLine:
    "Distributed systems by day. Grounded AI systems by craft.",
  contactCta: {
    title: "Let's talk",
    description:
      "I build production systems with AI where it fits. If you have an interesting reliability, platform, or AI-systems problem — let's talk.",
    contactLabel: "Contact",
  },
  greetingRoles: [
    "Software / AI Engineer",
    "Distributed Systems Builder",
    "Grounded RAG Engineer",
    "Realtime Voice AI Builder",
  ],
  greetingLead: "who ships distributed systems with",
  greetingBeamTerms: ["Evals", "Grounding", "Ops"] as const,
  heroNarratives: [
    "At Halliburton I ship event-driven backends that move enterprise well-planning data in real time.",
    "On the side I build production RAG, voice pipelines, and local LLM systems with evals and observability.",
    "This still feels like day one — bigger systems, harder reliability problems, end-to-end ownership.",
  ],
  focusAreas: [
    {
      title: "Enterprise OSDU publishing",
      detail: "Data transfer of multiple data products to OSDU",
    },
    {
      title: "AI-assisted quality engineering",
      detail: "Dual-agent Stryker loops, ≥95% coverage, reusable across 10+ teams",
    },
    {
      title: "Kafka platform reliability",
      detail: "Recovered capacity at 18,000 partitions and diagnosed the 4,000-ACL ceiling",
    },
    {
      title: "Event-driven orchestration",
      detail: "Node.js, Kafka, Redis, DSDT transfers, and idempotent job-state workflows",
    },
    {
      title: "Realtime transfer visibility",
      detail: "Kafka → Socket.IO status delivery scoped by well, scenario, and tenant",
    },
    {
      title: "Compliance & observability",
      detail: "New Relic tracing, structured logs, activity audits, and technical-status notifications",
    },
  ],
  projects: [
    {
      id: "resilience-hub",
      name: "Resilience Hub",
      tagline: "Production RAG with citations and eval gates",
      status: "Live",
      metrics: [
        { label: "Golden tests", value: "30/30" },
        { label: "Faithfulness", value: "1.0" },
        { label: "Relevancy", value: "0.90" },
      ],
      description:
        "A retrieval-augmented assistant over personal resilience notes — Flask orchestrates Gemini + Pinecone with Cohere reranking, citation-grounded answers, Firebase auth, and Cloud Run deployment.",
      why:
        "I wanted to stay consistent through personal challenges, but generic habit trackers never felt personal enough to stick. Building one around my own reflection process meant I could shape it to how I actually think — and feel invested enough to keep using it.",
      highlights: [
        "30/30 golden CI tests and 6/6 live RAGAS evals (1.0 faithfulness, 0.90 relevancy)",
        "Intent-aware routing that bypasses vector search for aggregate queries",
        "Langfuse per-stage tracing for retrieval and generation failures",
        "Per-user rate limiting and server-side secret management on Cloud Run",
      ],
      stack: [
        "Gemini",
        "Pinecone",
        "Cohere",
        "Flask",
        "Firebase",
        "Cloud Run",
        "Langfuse",
        "RAGAS",
        "React",
      ],
      github: "https://github.com/vectorvoyager358/resilience-hub",
      live: "https://vectorvoyager358.github.io/resilience-hub/login",
      accent: "#3EE0C5",
    },
    {
      id: "voxwire",
      name: "VoxWire",
      tagline: "Low-latency voice AI over WebSockets",
      status: "In progress",
      metrics: [
        { label: "Pipeline", value: "ASR→LLM→TTS" },
        { label: "Transport", value: "WebSocket" },
        { label: "Focus", value: "Resilience" },
      ],
      description:
        "Realtime voice pipeline streaming ASR → LLM → TTS with partial transcripts, token streaming, chunked audio playback, and production resilience patterns.",
      highlights: [
        "End-to-end streaming with latency waterfall instrumentation",
        "Timeouts, circuit breakers, provider abstraction, and retries",
        "Swappable ASR/LLM/TTS providers via env configuration",
        "Langfuse multi-stage timing to isolate bottlenecks",
      ],
      stack: [
        "FastAPI",
        "WebSockets",
        "Deepgram",
        "Gemini",
        "Cartesia",
        "TypeScript",
        "Langfuse",
      ],
      github: "https://github.com/vectorvoyager358/voxwire",
      live: "https://vectorvoyager358.github.io/voxwire/",
      accent: "#7EB8FF",
    },
    {
      id: "local-llm-bench",
      name: "Local LLM Inference Benchmarking",
      tagline: "Empirical SLM benchmarking on constrained hardware",
      status: "Open source",
      metrics: [
        { label: "Best tok/s", value: "41.82" },
        { label: "Models", value: "3 SLMs" },
        { label: "Hardware", value: "8GB M2" },
      ],
      description:
        "Offline evaluation of small language models with Ollama — comparing latency, throughput, memory, quality, and structured JSON outputs on 8 GB M2 hardware.",
      highlights: [
        "Selected Llama 3.2 3B as best local fit on 8 GB M2",
        "41.82 tok/s (Llama 3.2 3B) vs 19.33 tok/s (Mistral 7B)",
        "Separated cold-start vs warm TTFT from generation speed",
        "Pydantic-validated structured outputs with automatic retries",
      ],
      stack: ["Python", "Ollama", "Pydantic", "Llama 3.2:3B", "Phi-3:mini", "Mistral:7B"],
      github:
        "https://github.com/vectorvoyager358/Local-LLM-Inference-Benchmarking-System",
      accent: "#F0A46E",
    },
    {
      id: "moment-keeper",
      name: "Moment Keeper",
      tagline: "Capture life's moments without daily journaling pressure",
      status: "Product",
      metrics: [
        { label: "Stack", value: "Next.js" },
        { label: "Backend", value: "Supabase" },
        { label: "CI", value: "Actions" },
      ],
      description:
        "A Next.js product for capturing and revisiting meaningful memories — Supabase auth, Postgres, and storage with CI for lint, format, test, and build.",
      why:
        "I had the idea after realizing how quietly meaningful moments fade as life moves on: a first solo journey, the day years of work turn into a dream opportunity, a loved one's voice you wish you had recorded, or an ordinary afternoon that becomes precious later. I wanted one place to preserve those moments and revisit them whenever I want to.",
      highlights: [
        "App Router + TypeScript + Tailwind product surface",
        "Supabase auth, Postgres, and object storage",
        "GitHub Actions CI covering lint, format, test, and build",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind", "Supabase"],
      github: "https://github.com/vectorvoyager358/moment-keeper",
      live: "https://moment-keeper-two.vercel.app/",
      accent: "#C4B5FD",
    },
  ] satisfies Project[],
  experience: [
    {
      company: "Halliburton",
      role: "Software Engineer",
      location: "Houston, TX",
      start: "July 2024",
      end: "Present",
      summary: undefined,
      bullets: [
        "Engineered an event-driven OSDU publishing platform with Node.js microservices, Kafka, Redis, and WebSockets to synchronize well-planning data across enterprise systems.",
        "Built and maintained Angular feature UIs for the OSDU publishing platform, turning complex enterprise data workflows into clear, maintainable user experiences.",
        "Scaled AI-driven mutation testing across 10+ engineering teams with a dual-agent framework that reached ≥95% coverage via Stryker feedback loops.",
        "Unblocked Kafka deployments by identifying 200+ stale feature-branch topics and resolving Confluent limits at 18,000 partitions and 4,000 ACLs.",
        "Streamed Kafka status events through Socket.IO rooms for 7 OSDU transfer entities — repeat updates in 15–20s, first-time in ~2 minutes.",
        "Prevented duplicate transfers with Redis-backed idempotency, job-state caching, and asynchronous status orchestration.",
        "Integrated New Relic, structured logging, activity auditing, and Kafka technical status notifications for end-to-end observability.",
      ],
    },
  ] satisfies Experience[],
  education: [
    {
      school: "University of North Texas",
      degree: "M.S., Data Science",
      dates: "Aug 2022 – May 2024",
      detail: "GPA 3.9/4.0",
    },
    {
      school: "National Institute of Technology Jamshedpur",
      degree: "B.Tech., Electronics & Communication Engineering",
      dates: "July 2018 – May 2022",
      detail: "GPA 7.6/10.0",
    },
  ] satisfies Education[],
  certifications: [
    {
      name: "Claude 101",
      issuer: "Anthropic",
      url: "https://verify.skilljar.com/c/8d3qmqjsqe38",
      year: "2026",
      logo: "anthropic",
    },
    {
      name: "AI Fluency Framework & Foundations",
      issuer: "Anthropic",
      url: "https://verify.skilljar.com/c/bavk6ahdhv7r",
      year: "2026",
      logo: "anthropic",
    },
    {
      name: "GitHub Copilot",
      issuer: "Microsoft",
      url: "https://learn.microsoft.com/en-us/users/jeetheshreddy-4866/credentials/31fddf93f82e1ca4",
      year: "2026",
      logo: "microsoft",
    },
  ],
  skills: [
    {
      id: "systems",
      label: "Distributed Systems",
      items: [
        "Node.js microservices",
        "Kafka / Confluent",
        "Redis",
        "WebSockets / Socket.IO",
        "Idempotency & job state",
        "Observability (New Relic)",
      ],
    },
    {
      id: "ai",
      label: "AI / LLM",
      items: [
        "RAG & vector search",
        "Embeddings & reranking",
        "LLM evaluation (RAGAS)",
        "Prompt engineering",
        "Observability (Langfuse)",
        "Structured outputs",
        "AI agents & mutation testing",
        "Local LLM inference",
      ],
    },
    {
      id: "cloud",
      label: "Cloud & DevOps",
      items: [
        "Google Cloud Run",
        "Firebase",
        "Docker / Kubernetes / Helm",
        "Azure DevOps",
        "GitHub Actions / Jenkins",
        "CI/CD",
      ],
    },
    {
      id: "backend",
      label: "Backend & Languages",
      items: [
        "Python",
        "TypeScript / JavaScript",
        "C# / Java / SQL",
        "Flask / FastAPI",
        "Express / Hapi.js",
        "Angular / Next.js / React",
        "PostgreSQL / Supabase / Pinecone / SQLServer",
      ],
    },
  ] satisfies SkillCluster[],
  languages: [
    { name: "English", level: "Professional proficiency" },
    { name: "Telugu", level: "Native", native: true },
    { name: "Hindi", level: "Professional proficiency" },
    { name: "Spanish", level: "Still buffering…" },
  ] satisfies Language[],
  suggestedPrompts: [
    "What did Jeethesh build at Halliburton?",
    "Summarize Resilience Hub and its eval results",
    "How does VoxWire handle production failures?",
    "Why hire Jeethesh?",
    "Which local LLM won on 8 GB M2 hardware?",
  ],
} as const;

export type Profile = typeof profile;

export function buildGroundingContext(data: typeof profile = profile): string {
  const projects = data.projects
    .map(
      (p) =>
        `### ${p.name}\n${p.tagline}\n${p.description}${p.why ? `\nWhy I built it: ${p.why}` : ""}\nHighlights:\n${p.highlights.map((h) => `- ${h}`).join("\n")}\nStack: ${p.stack.join(", ")}\nGitHub: ${p.github}${p.live ? `\nLive: ${p.live}` : ""}`,
    )
    .join("\n\n");

  const experience = data.experience
    .map(
      (e) =>
        `### ${e.role} @ ${e.company} (${e.start} – ${e.end}, ${e.location})\n${e.bullets.map((b) => `- ${b}`).join("\n")}`,
    )
    .join("\n\n");

  const education = data.education
    .map(
      (ed) =>
        `- ${ed.degree}, ${ed.school} (${ed.dates})${ed.detail ? ` — ${ed.detail}` : ""}`,
    )
    .join("\n");

  const certifications = data.certifications
    .map(
      (c) =>
        `- ${c.name} (${c.issuer}${c.year ? `, ${c.year}` : ""}) — ${c.url}`,
    )
    .join("\n");

  const skills = data.skills
    .map((s) => `${s.label}: ${s.items.join(", ")}`)
    .join("\n");

  const languages = data.languages
    .map((lang) => `- ${lang.name}: ${lang.level}`)
    .join("\n");

  return [
    `# Profile: ${data.name}`,
    `Title: ${data.title}`,
    `Location: ${data.location}`,
    `Email: ${data.email}`,
    `GitHub: ${data.github}`,
    `LinkedIn: ${data.linkedin}`,
    "",
    "## Summary",
    data.summary,
    "",
    "## Experience",
    experience,
    "",
    "## Projects",
    projects,
    "",
    "## Education",
    education,
    "",
    "## Certifications",
    certifications,
    "",
    "## Skills",
    skills,
    "",
    "## Languages",
    languages,
  ].join("\n");
}

export function buildSystemPrompt(data: typeof profile = profile): string {
  return [
    `You are Ask Jeethesh — a concise, professional assistant that answers questions about ${data.shortName} (${data.name}), a ${data.title} based in ${data.location}.`,
    "Only answer using the grounded profile context below. If the question is unrelated to Jeethesh's background, experience, projects, skills, or contact info, politely decline and redirect to those topics.",
    "Be specific with metrics and stack details when available. Prefer short paragraphs or tight bullets. Do not invent employers, projects, or numbers.",
    "Speak in first person as Jeethesh (I / my / me). Sound professional and concise.",
    "Format lightly with Markdown when helpful (bullets, bold for key terms). Keep answers scannable.",
    "",
    "<profile_context>",
    buildGroundingContext(data),
    "</profile_context>",
  ].join("\n");
}
