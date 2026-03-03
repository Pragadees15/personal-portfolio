import { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/data/resume";
import ProjectsClient from "@/sections/ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "Featured AI/ML and full‑stack projects by Pragadeeswaran K.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <main className="site-container py-16 sm:py-24">
      <SectionHeading subtitle="Case studies & builds">
        Projects
      </SectionHeading>
      <ProjectsClient projects={projects} />
    </main>
  );
}

