import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ShareLinks } from "@/components/ShareLinks";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import Projects from "@/sections/Projects";
import { Contact } from "@/sections/Contact";
import { Education } from "@/sections/Education";
import { Certifications } from "@/sections/Certifications";
import { Experience } from "@/sections/Experience";
import { Honors } from "@/sections/Honors";
import { Leadership } from "@/sections/Leadership";
import { Interests } from "@/sections/Interests";
import { profile } from "@/data/resume";
import { getGithubUsernameFromUrl } from "@/lib/github";
import Terminal from "@/sections/Terminal";
import SocialProof from "@/sections/SocialProof";

export default function Home() {
  const githubUsername = getGithubUsernameFromUrl(profile.github);
  const avatarUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=512&v=4`;
  const year = new Date().getFullYear();

  return (
    <div className="font-sans">
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero avatarUrl={avatarUrl} />
        <SocialProof />
        <Terminal />
        <About avatarUrl={avatarUrl} />
        <Interests />
        <Skills />
        <Education />
        <Experience />
        <Projects />
        <Certifications />
        <Honors />
        <Leadership />
        <Contact avatarUrl={avatarUrl} />
      </main>
      <ScrollToTop />

      {/* Editorial footer / colophon */}
      <footer className="safe-bottom border-t border-foreground/10 mt-12 sm:mt-20">
        <div className="site-container py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-10 gap-x-8">
            <div className="sm:col-span-6 lg:col-span-7 flex flex-col gap-6">
              <p className="font-display text-4xl sm:text-5xl leading-[0.96] max-w-2xl">
                Made with curiosity in <em className="italic">Tiruvannamalai</em>
                <span className="lime-mark">.</span>
              </p>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                {profile.name} is an AI/ML engineer building human-centered AI —
                from computer vision and reinforcement learning research to
                production-ready ML systems and developer tools. This portfolio
                is built with Next.js 16, Tailwind 4, Instrument Serif &amp;
                Geist; edge-rendered, statically optimized, lovingly typeset.
              </p>

              <ShareLinks className="mt-2" />
            </div>

            <nav
              aria-label="Elsewhere on the web"
              className="sm:col-span-3 lg:col-span-3 flex flex-col gap-3 text-sm"
            >
              <span className="section-label">/ Elsewhere</span>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`${profile.name} on GitHub — open profile in new tab`}
                className="link-underline w-fit"
              >
                GitHub profile
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`${profile.name} on LinkedIn — open profile in new tab`}
                className="link-underline w-fit"
              >
                LinkedIn profile
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label={`Email ${profile.name} at ${profile.email}`}
                className="link-underline w-fit"
              >
                Email {profile.name.split(" ")[0]}
              </a>
              <a
                href="/resume"
                aria-label="Read the full resume of Pragadeeswaran K"
                className="link-underline w-fit"
              >
                Read résumé page
              </a>
              <a
                href="#contact"
                aria-label="Jump to the contact form section"
                className="link-underline w-fit"
              >
                Contact form
              </a>
            </nav>

            <nav
              aria-label="Page index"
              className="sm:col-span-3 lg:col-span-2 flex flex-col gap-3 text-sm"
            >
              <span className="section-label">/ Index</span>
              <a
                href="#about"
                aria-label="Jump to About section"
                className="link-underline w-fit"
              >
                About me
              </a>
              <a
                href="#projects"
                aria-label="Jump to selected projects section"
                className="link-underline w-fit"
              >
                Selected work
              </a>
              <a
                href="#experience"
                aria-label="Jump to experience section"
                className="link-underline w-fit"
              >
                Experience timeline
              </a>
              <a
                href="#hero"
                aria-label="Scroll back to top of the page"
                className="link-underline w-fit"
              >
                Back to top
              </a>
            </nav>
          </div>

          <div className="mt-12 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <div>
              © <time dateTime={String(year)}>{year}</time> {profile.name} · All
              rights reserved
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot" />
              <span>Available for work</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
