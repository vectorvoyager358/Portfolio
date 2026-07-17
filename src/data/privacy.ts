import { profile } from "@/data/profile";

export type PrivacySection = {
  heading: string;
  items?: string[];
  body?: string;
  email?: string;
};

export const privacyPolicy = {
  title: "Privacy Policy",
  lastUpdated: "Last updated: July 15, 2026",
  intro: `This policy describes how data is collected and used when you visit ${profile.brand}'s portfolio site.`,
  sections: [
    {
      heading: "What data is collected",
      items: [
        'Chatbot messages: when you interact with "Ask Jeethesh", messages are processed to generate responses. When observability is enabled, redacted and size-limited copies of the latest question and assistant reply may be retained in Langfuse. Do not submit sensitive information.',
        "Voice mode audio: if you use voice mode, audio is transcribed for that turn and is not permanently stored by this site.",
        "Server-side rate limiting may use a temporary network address to prevent abuse. These counters are not used for marketing or profiling.",
      ],
    },
    {
      heading: "How data is used",
      items: [
        "Chatbot messages are used only to generate contextual answers about Jeethesh's professional background.",
        "Redacted chat-turn traces are used to monitor reliability, latency, errors, and token usage.",
        "Transcribed voice text is passed into the same chat flow as typed messages.",
        "This site does not sell personal data or use it for advertising.",
      ],
    },
    {
      heading: "Third parties",
      items: [
        "NVIDIA NIM: processes Ask Jeethesh chat messages to generate responses.",
        "NVIDIA speech-to-text: processes voice-mode audio for transcription when you use voice mode.",
        "Langfuse: receives masked, size-limited chat-turn content and model telemetry when observability is configured. Full conversation history, network addresses, and user account identifiers are not sent to Langfuse by this site.",
        "Hosting provider: may collect standard anonymous request logs (pages visited, device, duration) as part of hosting the site.",
      ],
    },
    {
      heading: "Cookies and local storage",
      body: "This site does not use tracking cookies or third-party advertising cookies. Browser localStorage is used only for interface preferences (visual theme and ambient music prompt state). No personal information is stored there.",
    },
    {
      heading: "No user accounts",
      body: "This site does not require registration or login. Names, emails, and passwords are not collected through the website forms or the assistant.",
    },
    {
      heading: "Contact",
      body: "For any privacy-related inquiries, you can write to:",
      email: profile.email,
    },
  ] satisfies PrivacySection[],
  backHome: "Back to home",
} as const;
