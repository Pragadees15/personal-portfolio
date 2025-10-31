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
import Terminal from "@/sections/Terminal";

export default function Home() {
  return (
    <div className="font-sans">
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero />
        <Reveal><Terminal /></Reveal>
        <Reveal><About /></Reveal>
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
      <footer className="mt-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-300/70 to-transparent dark:via-white/10" />
        <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Pragadeeswaran K
        </div>
      </footer>
    </div>
  );
}
