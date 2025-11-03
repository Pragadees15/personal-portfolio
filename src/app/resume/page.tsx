export const dynamic = "force-static";

export const metadata = {
  title: "Resume — Pragadeeswaran K",
  description: "Download or view the resume of Pragadeeswaran K (AI/ML Engineer).",
  openGraph: {
    title: "Resume — Pragadeeswaran K",
    description: "View my resume and experience in AI/ML and Computer Vision.",
    images: [{ url: "/resume/opengraph-image", width: 1200, height: 630, alt: "Resume — Pragadeeswaran K" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Pragadeeswaran K",
    description: "View my resume and experience in AI/ML and Computer Vision.",
    images: ["/resume/opengraph-image"],
  },
} as const;

import ResumeClient from "./resume-client";

export default function ResumePage() {
  return <ResumeClient />;
}


