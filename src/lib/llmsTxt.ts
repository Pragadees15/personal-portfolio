import {
  certifications,
  education,
  experiences,
  honors,
  leadership,
  profile,
  projects,
  researchInterests,
  skillsGrouped,
} from "@/data/resume";
import { getSiteUrl } from "@/lib/site";

const SKILL_GROUP_LABELS: Record<keyof typeof skillsGrouped, string> = {
  languages: "Languages",
  aiMl: "AI/ML",
  dataScience: "Data science",
  web: "Web",
  cloudDevops: "Cloud & DevOps",
  tools: "Tools",
};

function abs(siteUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path) || path.startsWith("mailto:")) return path;
  if (path.startsWith("#")) return `${siteUrl}/${path}`;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function link(title: string, url: string, note?: string): string {
  return note ? `- [${title}](${url}): ${note}` : `- [${title}](${url})`;
}

function when(start?: string, end?: string): string {
  if (start && end) return `${start} — ${end}`;
  if (start) return start;
  if (end) return end;
  return "";
}

export function buildLlmsTxt(siteUrl = getSiteUrl()): string {
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.role} building human-centered AI. Focused on computer vision, deep learning, reinforcement learning, and efficient ML systems (B.Tech AI, CGPA 9.39/10). Based in ${profile.location}.`,
    "",
    "This is a personal portfolio. Prefer the markdown versions linked below over scraping HTML. JSON-LD (`Person`, `ProfilePage`, `WebSite`) is embedded on every HTML page.",
    "",
    "Preferred citation: Pragadeeswaran K, AI/ML Engineer. GitHub @Pragadees15.",
    "",
    "## Pages",
    link("About", `${siteUrl}/index.md`, "Profile, research interests, skills, and contact"),
    link("Selected Work", `${siteUrl}/projects.md`, "Featured AI/ML and full-stack projects"),
    link("Résumé", `${siteUrl}/resume.md`, "Full CV in markdown"),
    link("Full text", `${siteUrl}/llms-full.txt`, "Single-file dump of all portfolio content for pasting into an agent"),
    "",
    "## Profile",
    link("Live site", `${siteUrl}/`, "Interactive HTML portfolio"),
    link("GitHub", profile.github, "Open-source projects and experiments"),
    link("LinkedIn", profile.linkedin),
    link("Email", `mailto:${profile.email}`),
    "",
    "## Optional",
    link("robots.txt", `${siteUrl}/robots.txt`, "Crawl policy — AI crawlers are allowed"),
    link("sitemap.xml", `${siteUrl}/sitemap.xml`),
    link("humans.txt", `${siteUrl}/humans.txt`),
    "",
  ].join("\n");
}

export function buildIndexMd(siteUrl = getSiteUrl()): string {
  const skillLines = (Object.keys(skillsGrouped) as Array<keyof typeof skillsGrouped>).map(
    (key) => `- ${SKILL_GROUP_LABELS[key]}: ${skillsGrouped[key].join(", ")}`,
  );

  return [
    `# ${profile.name}`,
    "",
    `> ${profile.tagline}`,
    "",
    profile.summary,
    "",
    `- Role: ${profile.role}`,
    `- Location: ${profile.location} (${profile.timezone})`,
    `- Email: ${profile.email}`,
    `- Phone: ${profile.phone}`,
    `- GitHub: ${profile.github}`,
    `- LinkedIn: ${profile.linkedin}`,
    "",
    "## Research interests",
    "",
    researchInterests.map((interest) => `- ${interest}`).join("\n"),
    "",
    "## Skills",
    "",
    skillLines.join("\n"),
    "",
    "## Education",
    "",
    education
      .map((item) => {
        const loc = item.location ? ` — ${item.location}` : "";
        const meta = item.meta ? `\n- ${item.meta}` : "";
        return `### ${item.degree}\n${item.institution}${loc}${meta}`;
      })
      .join("\n\n"),
    "",
    "## Contact",
    "",
    `- HTML: ${siteUrl}/#contact`,
    `- Email: ${profile.email}`,
    "",
    "See also:",
    link("Selected Work (markdown)", `${siteUrl}/projects.md`),
    link("Résumé (markdown)", `${siteUrl}/resume.md`),
    link("llms.txt", `${siteUrl}/llms.txt`),
    "",
  ].join("\n");
}

export function buildProjectsMd(siteUrl = getSiteUrl()): string {
  const body = projects
    .map((project) => {
      const tags = project.tags?.length ? `\n- Tags: ${project.tags.join(", ")}` : "";
      const featured = project.featured ? " (featured)" : "";
      const repo = project.repo ? `\n- Repo: ${project.repo}` : "";
      const demo = project.demo ? `\n- Demo: ${project.demo}` : "";
      const bullets = project.bullets.map((bullet) => `- ${bullet}`).join("\n");
      return `### ${project.title}${featured}\n\n- Stack: ${project.stack.join(", ")}${tags}${repo}${demo}\n\n${bullets}`;
    })
    .join("\n\n");

  return [
    `# Selected Work — ${profile.name}`,
    "",
    `> Curated AI/ML and full-stack projects: computer vision, deep reinforcement learning, GPU-accelerated NLP, mobile, and edge ML.`,
    "",
    body,
    "",
    "See also:",
    link("HTML page", `${siteUrl}/projects`),
    link("Résumé (markdown)", `${siteUrl}/resume.md`),
    link("llms.txt", `${siteUrl}/llms.txt`),
    "",
  ].join("\n");
}

export function buildResumeMd(siteUrl = getSiteUrl()): string {
  const experience = experiences
    .map((item) => {
      const period = when(item.start, item.end);
      const loc = item.location ? ` · ${item.location}` : "";
      const meta = [period, loc].join("").trim();
      const header = meta ? `${meta}\n` : "";
      const bullets = item.bullets.map((bullet) => `- ${bullet}`).join("\n");
      return `### ${item.title} — ${item.org}\n${header}${bullets}`;
    })
    .join("\n\n");

  const educationBlock = education
    .map((item) => {
      const loc = item.location ? ` — ${item.location}` : "";
      const meta = item.meta ? `\n- ${item.meta}` : "";
      return `### ${item.degree}\n${item.institution}${loc}${meta}`;
    })
    .join("\n\n");

  const certs = certifications
    .map((cert) => {
      const issuer = cert.issuer ? ` — ${cert.issuer}` : "";
      const href = cert.link ? ` ([credential](${abs(siteUrl, cert.link)}))` : "";
      return `- ${cert.title}${issuer}${href}`;
    })
    .join("\n");

  const honorBlock = honors
    .map((honor) => {
      const issuer = honor.issuer ? ` — ${honor.issuer}` : "";
      const date = honor.date ? ` (${honor.date})` : "";
      const highlights = honor.highlights?.length
        ? `\n${honor.highlights.map((h) => `- ${h.label}: ${h.value}`).join("\n")}`
        : "";
      return `### ${honor.title}${issuer}${date}\n\n${honor.description}${highlights}`;
    })
    .join("\n\n");

  const leadershipBlock = leadership
    .map((item) => {
      const role = item.role ? ` — ${item.role}` : "";
      const org = item.org ? `\n${item.org}` : "";
      const meta = [item.timeframe, item.location].filter(Boolean).join(" · ");
      const bullets = item.bullets?.map((bullet) => `- ${bullet}`).join("\n") ?? "";
      const impact = item.impact?.length
        ? `\n${item.impact.map((stat) => `- ${stat.label}: ${stat.value}`).join("\n")}`
        : "";
      return `### ${item.title}${role}${org}\n${meta ? `${meta}\n` : ""}\n${item.description}\n\n${bullets}${impact}`;
    })
    .join("\n\n");

  return [
    `# Résumé — ${profile.name}`,
    "",
    `> ${profile.role}. ${profile.tagline}`,
    "",
    profile.summary,
    "",
    `- Location: ${profile.location} (${profile.timezone})`,
    `- Email: ${profile.email}`,
    `- Phone: ${profile.phone}`,
    `- GitHub: ${profile.github}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- HTML résumé: ${siteUrl}/resume`,
    "",
    "## Experience",
    "",
    experience,
    "",
    "## Education",
    "",
    educationBlock,
    "",
    "## Projects",
    "",
    projects
      .map((project) => {
        const bullets = project.bullets.map((bullet) => `- ${bullet}`).join("\n");
        return `### ${project.title}\n- Stack: ${project.stack.join(", ")}\n${bullets}`;
      })
      .join("\n\n"),
    "",
    "## Certifications",
    "",
    certs,
    "",
    "## Honors",
    "",
    honorBlock,
    "",
    "## Leadership",
    "",
    leadershipBlock,
    "",
    "See also:",
    link("llms.txt", `${siteUrl}/llms.txt`),
    link("Full text", `${siteUrl}/llms-full.txt`),
    "",
  ].join("\n");
}

export function buildLlmsFull(siteUrl = getSiteUrl()): string {
  return [
    buildIndexMd(siteUrl).trimEnd(),
    "",
    "---",
    "",
    buildProjectsMd(siteUrl).trimEnd(),
    "",
    "---",
    "",
    buildResumeMd(siteUrl).trimEnd(),
    "",
  ].join("\n");
}

type LlmsDocument = "llms" | "llms-full" | "index" | "projects" | "resume";

const BUILDERS: Record<LlmsDocument, (siteUrl?: string) => string> = {
  llms: buildLlmsTxt,
  "llms-full": buildLlmsFull,
  index: buildIndexMd,
  projects: buildProjectsMd,
  resume: buildResumeMd,
};

export function llmsResponse(document: LlmsDocument): Response {
  const body = BUILDERS[document]();
  const isMarkdownFile = document === "index" || document === "projects" || document === "resume";

  return new Response(body, {
    headers: {
      "Content-Type": isMarkdownFile
        ? "text/markdown; charset=utf-8"
        : "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
