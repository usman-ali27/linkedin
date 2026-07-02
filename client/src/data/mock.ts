import {
  BriefcaseBusiness,
  Flame,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Megaphone,
} from "lucide-react";

export const navItems = [
  "Home",
  "My Network",
  "Jobs",
  "Messaging",
  "Notifications",
] as const;

export const trendingTopics = [
  { title: "AI product design", posts: "18.2k posts", icon: Lightbulb },
  { title: "Remote leadership", posts: "9.7k posts", icon: BriefcaseBusiness },
  { title: "Career growth", posts: "14.1k posts", icon: GraduationCap },
  { title: "Founders circle", posts: "6.4k posts", icon: Flame },
];

export const suggestedPeople = [
  {
    name: "Ariana Khan",
    title: "Product Designer at Loomwave",
    mutuals: "12 mutual connections",
  },
  {
    name: "Daniel Brooks",
    title: "Engineering Manager at Northstar",
    mutuals: "8 mutual connections",
  },
  {
    name: "Priya Shah",
    title: "Growth Lead at Vertex Labs",
    mutuals: "21 mutual connections",
  },
];

export const profileHighlights = [
  { label: "Profile views", value: "2,184" },
  { label: "Post impressions", value: "34.8k" },
  { label: "Connections", value: "1,248" },
];

export const userProfile = {
  name: "Maya Chen",
  role: "Product Strategist | SaaS | Human-centered AI",
  location: "San Francisco, CA",
  headline:
    "Building thoughtful digital products that help teams move faster without losing the human layer.",
  about:
    "I design and launch product experiences across AI, analytics, and collaboration software. My focus is on crisp product thinking, clean systems, and measurable user impact.",
  stats: [
    { label: "Followers", value: "68k" },
    { label: "Connections", value: "1,248" },
    { label: "Open to", value: "Advisory & consulting" },
  ],
  experience: [
    {
      title: "Senior Product Strategist",
      company: "Northstar AI",
      period: "2022 - Present",
      summary:
        "Led the launch of a collaborative workflow suite used by 40k+ teams.",
    },
    {
      title: "Product Designer",
      company: "Signal Studio",
      period: "2018 - 2022",
      summary:
        "Shipped data-heavy dashboards and onboarding systems for enterprise software.",
    },
  ],
  skills: [
    "Product Strategy",
    "UX Systems",
    "Research",
    "Go-to-market",
    "Design Ops",
  ],
};

export const peopleCard = {
  name: "Maya Chen",
  title: "Product Strategist at Northstar AI",
  location: "San Francisco, CA",
  avatar: "MC",
};

export const stories = [
  {
    title: "Hiring season",
    by: "Ariana",
    accent: "from-cyan-500 to-sky-600",
  },
  {
    title: "Roadmap week",
    by: "Daniel",
    accent: "from-slate-700 to-slate-900",
  },
  {
    title: "AI notes",
    by: "Priya",
    accent: "from-emerald-500 to-teal-600",
  },
];

export const feedPosts = [
  {
    id: 1,
    author: "Alyssa Martin",
    role: "Head of Product at Loomwave",
    time: "2h",
    audience: "Public",
    content:
      "Shipped a lightweight roadmap experience this week. The biggest win was not the feature count, but how much faster the team could understand what is happening, what is blocked, and what comes next.",
    image:
      "linear-gradient(135deg, rgba(14,165,233,0.95), rgba(59,130,246,0.8), rgba(15,23,42,0.88))",
    likesCount: 184,
    comments: [
      {
        author: "Maya Chen",
        time: "1h",
        text: "This is such a strong framing. Speed plus clarity usually beats complexity every time.",
      },
      {
        author: "Jordan Lee",
        time: "48m",
        text: "The blocked-next-up view sounds like a huge team alignment win.",
      },
    ],
    tags: ["product", "shipping", "teamwork"],
  },
  {
    id: 2,
    author: "Nina Patel",
    role: "Founder at Bluefin",
    time: "5h",
    audience: "Connections only",
    content:
      "A small team can create a premium brand if the product, content, and motion systems all tell the same story. Consistency is a growth feature.",
    image:
      "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.82), rgba(15,23,42,0.86))",
    likesCount: 92,
    comments: [
      {
        author: "Maya Chen",
        time: "3h",
        text: "That consistency signal is real. People feel it before they can describe it.",
      },
    ],
    tags: ["branding", "startup", "growth"],
  },
  {
    id: 3,
    author: "Marcus Allen",
    role: "Engineering Manager at Atlas",
    time: "1d",
    audience: "Public",
    content:
      "When hiring, I look for engineers who can explain tradeoffs clearly. Code matters, but communication is what keeps the product moving under pressure.",
    image:
      "linear-gradient(135deg, rgba(30,41,59,0.96), rgba(51,65,85,0.82), rgba(14,116,144,0.72))",
    likesCount: 241,
    comments: [
      {
        author: "Priya Shah",
        time: "18h",
        text: "Communication is the multiplier people underestimate the most.",
      },
      {
        author: "Ariana Khan",
        time: "16h",
        text: "Exactly. Fast teams are usually just clear teams.",
      },
    ],
    tags: ["hiring", "engineering", "communication"],
  },
];

export const quickActions = [
  { icon: Megaphone, label: "Start a post" },
  { icon: HeartHandshake, label: "Celebrate" },
  { icon: MapPin, label: "Add location" },
];
