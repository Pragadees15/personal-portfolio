type FetchOptions = RequestInit & { next?: { revalidate?: number } };

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(buffer).toString("base64");
    }
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    if (typeof btoa !== "undefined") {
        return btoa(binary);
    }
    return "";
}

export async function fetchAvatarDataUrl(avatarUrl: string, init?: FetchOptions): Promise<string> {
    try {
        const response = await fetch(avatarUrl, init);
        if (!response.ok) {
            return avatarUrl;
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64 = arrayBufferToBase64(arrayBuffer);
        if (!base64) {
            return avatarUrl;
        }
        const contentType = response.headers.get("content-type") || "image/png";
        return `data:${contentType};base64,${base64}`;
    } catch {
        return avatarUrl;
    }
}


