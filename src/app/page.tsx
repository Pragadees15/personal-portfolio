import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
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
import { Reveal } from "@/components/Reveal";
import { profile } from "@/data/resume";
import Terminal from "@/sections/Terminal";
import SocialProof from "@/sections/SocialProof";

export default function Home() {
  const githubUsername = profile.github?.split("/").pop() || "Pragadees15";
  // Single shared avatar URL used across the page so it resolves once and is reused everywhere
  const avatarUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=512&v=4`;

  return (
    <div className="font-sans">
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero avatarUrl={avatarUrl} />
        <Reveal><SocialProof /></Reveal>
        <Reveal><Terminal /></Reveal>
        <Reveal><About avatarUrl={avatarUrl} /></Reveal>
        <Reveal><Interests /></Reveal>
        <Reveal><Skills /></Reveal>
        <Reveal><Education /></Reveal>
        <Reveal><Experience /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><Certifications /></Reveal>
        <Reveal><Honors /></Reveal>
        <Reveal><Leadership /></Reveal>
        <Reveal><Contact /></Reveal>
      </main>
      <ScrollToTop />
      <footer className="mt-12 sm:mt-16 safe-bottom">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-300/70 to-transparent dark:via-white/10" />
        <div className="site-container py-8 sm:py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Pragadeeswaran K
              </p>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                AI/ML Engineer • Building Intelligent Systems
              </p>
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 rounded-full" />
            <div className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} Pragadeeswaran K. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
