import { NextRequest, NextResponse } from "next/server";

const GITHUB_OG_BASE = "https://opengraph.githubassets.com";

// Serve from the edge so the cache sits as close to users as possible
export const runtime = "edge";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    // Optional cache version – lets you force a refresh without changing owner/repo
    const v = searchParams.get("v") ?? "stable";

    if (!owner || !repo) {
        return new NextResponse("Missing owner or repo", { status: 400 });
    }

    const targetUrl = `${GITHUB_OG_BASE}/1/${encodeURIComponent(owner)}/${encodeURIComponent(
        repo,
    )}?v=${encodeURIComponent(v)}`;

    try {
        const res = await fetch(targetUrl, {
            headers: {
                Accept: "image/*",
            },
            // Cache this image on the edge for a day; only one origin request per
            // owner/repo/v combo in that window, regardless of how many visitors you get.
            next: { revalidate: 60 * 60 * 24 },
        });

        if (!res.ok) {
            return new NextResponse("Failed to fetch GitHub OG image", { status: res.status });
        }

        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get("content-type") ?? "image/png";

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                // Cache for browsers and CDNs; Vercel will respect s-maxage for its edge cache
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
            },
        });
    } catch (error) {
        console.error("[github-og] error", error);
        return new NextResponse("Error fetching GitHub OG image", { status: 500 });
    }
}


