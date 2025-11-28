export type Link = { label: string; href: string };

export type EducationItem = {
  degree: string;
  institution: string;
  location?: string;
  meta?: string;
};

export type CertificationItem = { title: string; issuer?: string; link?: string };

export type ExperienceItem = {
  title: string;
  org: string;
  location?: string;
  start?: string;
  end?: string;
  bullets: string[];
};

export type ProjectItem = {
  title: string;
  stack: string[];
  bullets: string[];
  repo?: string;
  demo?: string;
  image?: string;
};

export type HonorHighlight = { label: string; value: string };

export type HonorItem = {
  title: string;
  issuer?: string;
  date?: string;
  description: string;
  highlights?: HonorHighlight[];
  tags?: string[];
  link?: string;
};

export type LeadershipStat = { label: string; value: string };

export type LeadershipItem = {
  title: string;
  role?: string;
  org?: string;
  timeframe?: string;
  location?: string;
  description: string;
  bullets?: string[];
  impact?: LeadershipStat[];
  tags?: string[];
  link?: string;
};

export const profile = {
  name: "Pragadeeswaran K",
  role: "AI/ML Engineer",
  location: "Tiruvannamalai, IN",
  email: "pragadees1323@gmail.com",
  phone: "+91-9943692130",
  github: "https://github.com/Pragadees15",
  linkedin: "https://www.linkedin.com/in/pragadees15/",
  // Short tagline for hero
  tagline: "Designing human‑centered AI: quick to launch, effortless to trust.",
  summary:
    "AI/ML engineer passionate about turning research into reliable, usable products. I work across computer vision, deep learning, reinforcement learning, and agentic AI, with a focus on efficient training and clean, reproducible pipelines (CGPA 9.31/10). I love shipping experiences with elegant UX and clear documentation, and I actively build open‑source projects and learning tools.",
  links: [
    { label: "GitHub", href: "https://github.com/Pragadees15" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pragadees15/" },
    { label: "Email", href: "mailto:pragadees1323@gmail.com" },
  ] as Link[],
};

export const researchInterests = [
  "Computer Vision",
  "Deep Learning",
  "Reinforcement Learning",
  "Agentic AI",
  "Efficient/Accelerated ML",
  "Applied Statistics",
  "NLP",
  "Generative Models",
];

export const education: EducationItem[] = [
  {
    degree: "B.Tech, Artificial Intelligence",
    institution: "SRM Institute of Science and Technology",
    location: "Chennai, India",
    meta: "CGPA 9.31/10.0 | Expected Graduation: May 2026",
  },
  {
    degree: "Higher Secondary (Class 12)",
    institution: "Jeeva Velu Intl. School",
    meta: "2022 • 81.8% (Computer Science)",
  },
  {
    degree: "Secondary (Class 10)",
    institution: "Sri Siksha Kendra Intl. School",
    meta: "2020 • 83.4%",
  },
];

export const certifications: CertificationItem[] = [
  { title: "NPTEL: Programming in Java", link: "/NPTEL%20Programming%20In%20Java.pdf" },
  { title: "NPTEL: Database Management System", link: "/NPTEL%20Data%20Base%20Management%20System.pdf" },
  { title: "NPTEL: Computer Architecture", link: "/NPTEL%20Computer%20Architecture.pdf" },
  { title: "Oracle Cloud Infrastructure 2024 GenAI Certified Professional", link: "/Oracle%20Cloud%20Infrastructure.pdf" },
  { title: "Oracle Cloud Computing Foundations", link: "/Oracle%20Cloud%20Computing.pdf" },
  { title: "AWS Academy: Machine Learning Foundations", link: "/AWS%20Machine%20Learning.pdf" },
  { title: "AWS Academy: Data Engineering", link: "/AWS%20Data%20Engineering.pdf" },
  { title: "AWS Academy: Cloud Foundations", link: "/AWS%20Cloud%20Foundations.pdf" },
  { title: "Hackathon: CINTEL Digithon", link: "/CINTEL%20Digithon%20Participation%20Certificate.pdf" },
  { title: "Hackathon: Hackstreet 3.0", link: "/Hackstreet%203.0%20Certificate%20.pdf" },
  { title: "Hackathon: Webathon", link: "/Webathon%20Certificate.pdf" },
];

export const skillsGrouped = {
  languages: ["Python", "TypeScript", "JavaScript", "SQL", "Java", "Dart", "HTML", "CSS"],
  aiMl: [
    "TensorFlow",
    "PyTorch",
    "Keras",
    "Scikit-learn",
    "OpenCV",
    "RAPIDS cuDF/cuML",
    "NLTK",
    "Hugging Face",
  ],
  dataScience: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "SPSS", "Stats", "Hypothesis Testing"],
  web: ["React", "Next.js 14", "Tailwind CSS", "TypeScript", "REST APIs", "Flask", "Node.js"],
  cloudDevops: ["AWS", "Oracle Cloud", "Vercel", "Git/GitHub", "CI/CD", "Serverless"],
  tools: ["Streamlit", "Jupyter", "VS Code", "Beautiful Soup", "PyTesseract", "Docker", "Pygame"],
};

export const projects: ProjectItem[] = [
  {
    title: "GPU-Accelerated Fake News Detection System",
    stack: ["RAPIDS", "cuDF", "cuML", "Python"],
    bullets: [
      "Built text classification with GPU-accelerated preprocessing and training",
      "Compared runtime/accuracy trade-offs across dataset sizes",
    ],
    repo: "https://github.com/Pragadees15",
  },
  {
    title: "Autonomous Driving Simulation (Deep Q-Learning)",
    stack: ["PyTorch", "RL", "Pygame"],
    bullets: [
      "Implemented DQN with replay + target networks; studied stability",
      "Analyzed learning curves and exploration schedules",
    ],
    repo: "https://github.com/Pragadees15",
  },
  {
    title: "Acadion Mobile (SRM Academia Companion)",
    stack: ["React Native", "TypeScript"],
    bullets: [
      "Privacy-first companion app with offline-first state and secure storage",
    ],
    repo: "https://github.com/Pragadees15",
  },
  {
    title: "EduSmartBot (AI Educational Assistant)",
    stack: ["NLP", "Flask", "OCR", "Scraping"],
    bullets: ["Integrated scraping, PyTesseract OCR, and quiz generation"],
    repo: "https://github.com/Pragadees15",
  },
  {
    title: "Stock Price Prediction (Multi-Model Ensemble)",
    stack: ["Time Series", "HMM", "LSTM", "RNN"],
    bullets: ["Compared HMM/LSTM/RNN baselines with standard error metrics"],
    repo: "https://github.com/Pragadees15",
  },
];

export const experiences: ExperienceItem[] = [
  {
    title: "AI/ML Student Researcher",
    org: "Self-Directed Study and Coursework, SRMIST",
    location: "Chennai, India",
    start: "Jun 2023",
    end: "Present",
    bullets: [
      "Designed and executed ML experiments; reproducible pipelines and ablations",
      "Statistical analysis with Python/SPSS: hypothesis tests, correlation, regression",
      "Baseline replication and literature review; presented findings and mentored peers",
    ],
  },
  {
    title: "Technical Projects & Open Source",
    org: "Independent Work",
    location: "Remote",
    start: "Jan 2024",
    end: "Present",
    bullets: [
      "Built Acadion Mobile; portfolio with Next.js 14 & Tailwind; CI/CD and testing workflows",
      "Contributed to open-source (Seat Finder, Acadion Mobile, Raspberry Pi Security Camera)",
    ],
  },
  {
    title: "Internships & Virtual Programs",
    org: "AICTE Eduskills, Google Android Developer, ALTAIR",
    bullets: [
      "AWS AI-ML Virtual Internship: SageMaker, deployment, MLOps",
      "AWS Data Engineering: pipelines, ETL, warehousing",
      "Android Dev: Material Design, architecture components",
      "ALTAIR Data Science Master: analytics, visualization, modeling",
    ],
  },
];

export const honors: HonorItem[] = [
  {
    title: "Top Decile CGPA — 9.31/10",
    issuer: "SRM Institute of Science and Technology",
    date: "2022 — Present",
    description: "Maintained a 9.31 CGPA across the AI curriculum while balancing research projects, hackathons, and open-source work.",
    highlights: [
      { label: "Rank", value: "Top 10%" },
      { label: "Semesters", value: "4/4 distinction" },
    ],
    tags: ["Academic Excellence", "AI Major"],
  },
  {
    title: "AICTE x AWS Virtual Internship (AI-ML + Data Eng)",
    issuer: "AICTE Eduskills • AWS Academy",
    date: "2024",
    description: "Completed national virtual internship tracks focused on SageMaker workflows, MLOps, and analytics pipelines with weekly mentor reviews.",
    highlights: [
      { label: "Tracks", value: "AI-ML & Data" },
      { label: "Deliverables", value: "End-to-end labs" },
    ],
    tags: ["National Program", "AWS", "MLOps"],
    link: "/AWS%20Machine%20Learning.pdf",
  },
  {
    title: "Multi-cloud & NPTEL Certification Streak",
    issuer: "Oracle • AWS Academy • NPTEL",
    date: "2023 — 2024",
    description: "Finished 9 industry-backed credentials spanning Oracle Cloud, AWS cloud/data/ML, and NPTEL core CS courses to reinforce fundamentals.",
    highlights: [
      { label: "Credentials", value: "9 issued" },
      { label: "Domains", value: "Cloud • ML • CS" },
    ],
    tags: ["Certifications", "Continuous Learning"],
    link: "/Oracle%20Cloud%20Infrastructure.pdf",
  },
  {
    title: "Rapid Hackathon Builder",
    issuer: "CINTEL Digithon • Hackstreet 3.0 • Webathon",
    date: "2024",
    description: "Led small teams to deliver polished MVPs for social impact, developer workflows, and education challenges within 24–36 hour hackathons.",
    highlights: [
      { label: "Events", value: "3 shipped" },
      { label: "Role", value: "Lead dev & UI" },
    ],
    tags: ["Hackathons", "Product Sense", "Teamwork"],
    link: "/Hackstreet%203.0%20Certificate%20.pdf",
  },
  {
    title: "Open-source Experience Kits",
    issuer: "GitHub Community",
    date: "Ongoing",
    description: "Documented and released reproducible guides for projects like Acadion Mobile, Seat Finder, and a Raspberry Pi security camera to help peers learn faster.",
    highlights: [
      { label: "Projects", value: "4+ shipped" },
      { label: "Focus", value: "Docs & UX" },
    ],
    tags: ["Open Source", "Documentation"],
  },
];

export const leadership: LeadershipItem[] = [
  {
    title: "Hackathon Pod Lead",
    role: "Product & Tech Lead",
    org: "CINTEL Digithon • Hackstreet 3.0 • Webathon",
    timeframe: "2023 — 2024",
    location: "Chennai, India & Remote",
    description: "Formed cross-functional pods and shepherded AI + UX MVPs from idea to demo-ready builds under 24–36 hour hackathon timelines.",
    bullets: [
      "Scoped the problem, split the backlog, and unblocked teammates with rapid architecture decisions",
      "Balanced ML experimentation with polished UI flows so judges could feel the product vision",
    ],
    impact: [
      { label: "Hackathons", value: "3 shipped" },
      { label: "Team size", value: "4–6 builders" },
    ],
    tags: ["Hackathons", "Product Sense", "Rapid Delivery"],
    link: "/Hackstreet%203.0%20Certificate%20.pdf",
  },
  {
    title: "Peer Mentoring Collective",
    role: "Python/ML Mentor",
    org: "SRMIST AI Cohort",
    timeframe: "2023 — Present",
    location: "SRMIST, Chennai",
    description: "Run weekly office hours and walkthroughs covering Python fundamentals, ML experimentation, and full-stack deployment to onboard juniors into AI labs.",
    bullets: [
      "Designed reproducible Colab notebooks, cheatsheets, and starter repos to accelerate lab readiness",
      "Pair-programmed debugging sessions that emphasized reading docs, writing tests, and version control",
    ],
    impact: [
      { label: "Students", value: "40+ coached" },
      { label: "Sessions", value: "1–2 / week" },
    ],
    tags: ["Mentorship", "Community", "Education"],
  },
  {
    title: "Open-source Experience Kits",
    role: "Docs & UX Steward",
    org: "GitHub Community",
    timeframe: "2022 — Present",
    location: "Remote",
    description: "Package personal projects (Acadion Mobile, Seat Finder, Raspberry Pi Security Camera) into plug-and-play templates with walkthrough docs and Loom-style demos.",
    bullets: [
      "Maintained issue templates, release notes, and quick-start scripts to lower contributor friction",
      "Added architecture maps, screenshots, and FAQ sections so readers can install in under 10 minutes",
    ],
    impact: [
      { label: "Starter kits", value: "4 released" },
      { label: "Clones/Forks", value: "35+" },
    ],
    tags: ["Open Source", "Documentation", "Developer Experience"],
    link: "https://github.com/Pragadees15",
  },
  {
    title: "Community Programs & Labs",
    role: "Participant & Facilitator",
    org: "AICTE Eduskills • Google Android • Altair & more",
    timeframe: "2023 — 2024",
    location: "Hybrid",
    description: "Active in national upskilling cohorts and virtual internships, sharing recap notes, mini-projects, and curated resources so peers can keep pace with fast-moving ML trends.",
    bullets: [
      "Facilitated study groups for AICTE x AWS, Google Android Developer Club, and Altair Data Science Master",
      "Documented weekly takeaways plus action items to help juniors replicate lab work quickly",
    ],
    impact: [
      { label: "Programs", value: "5+ cohorts" },
      { label: "Recap decks", value: "12 published" },
    ],
    tags: ["Community", "Programs", "Knowledge Sharing"],
  },
];


