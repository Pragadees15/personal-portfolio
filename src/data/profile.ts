export const profile = {
  name: "Pragadeeswaran K",
  title: "AI/ML Engineer",
  location: "Tiruvannamalai, IN",
  email: "pragadees1323@gmail.com",
  phone: "+91-9943692130",
  github: "https://github.com/Pragadees15",
  linkedin: "https://www.linkedin.com/in/pragadees-waran-a9280a253/",
  summary:
    "B.Tech AI (CGPA 9.31/10.0). Focused on computer vision, representation learning, reinforcement learning, and efficient ML systems.",
};

export const skills = [
  "Python",
  "TypeScript",
  "TensorFlow",
  "PyTorch",
  "RAPIDS",
  "OpenCV",
  "React/Next.js",
  "Tailwind CSS",
  "AWS",
  "SPSS",
  "SQL",
];

export type Project = {
  title: string;
  tech: string[];
  href?: string;
  repo?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    title: "GPU-Accelerated Fake News Detection",
    tech: ["RAPIDS", "cuDF", "cuML", "Python"],
    href: "#",
    repo: "https://github.com/Pragadees15",
    image: "/window.svg",
  },
  {
    title: "Autonomous Driving DQN",
    tech: ["PyTorch", "RL", "Pygame"],
    href: "#",
    repo: "https://github.com/Pragadees15",
    image: "/window.svg",
  },
  {
    title: "Acadion Mobile",
    tech: ["React Native", "TypeScript"],
    href: "#",
    repo: "https://github.com/Pragadees15",
    image: "/window.svg",
  },
];


