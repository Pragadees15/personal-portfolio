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
    "AI/ML engineer passionate about turning research into reliable, usable products. I work across computer vision, deep learning, and reinforcement learning, with a focus on efficient training and clean, reproducible pipelines (CGPA 9.31/10). I love shipping experiences with elegant UX and clear documentation, and I actively build open‑source projects and learning tools.",
  links: [
    { label: "GitHub", href: "https://github.com/Pragadees15" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pragadees15/" },
    { label: "Email", href: "mailto:pragadees1323@gmail.com" },
  ] as Link[],
};

export const researchInterests = [
  "Computer Vision",
  "Deep Learning",
  "Representation Learning",
  "Reinforcement Learning",
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
  { title: "AWS Academy: Machine Learning Foundations" },
  { title: "AWS Academy: Data Engineering" },
  { title: "AWS Academy: Cloud Foundations" },
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

export const honors = [
  "CGPA 9.31/10.0 (top decile)",
  "Hackathon participation: CINTEL Digithon, Hackstreet 3.0, Webathon",
  "Multiple certifications across Oracle/AWS/NPTEL",
  "Open-source projects with documentation and guides",
];

export const leadership = [
  "Active hackathon participant with deadline-driven delivery",
  "Peer mentoring in Python, ML, and full-stack",
  "Open-source contributions focusing on UI/UX and docs",
  "Active in tech communities and virtual learning programs",
];


