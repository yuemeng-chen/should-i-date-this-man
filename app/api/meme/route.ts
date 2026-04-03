import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const memelordKey = process.env.MEMELORD_API_KEY;
  if (!memelordKey) {
    return NextResponse.json({ memeUrl: null });
  }

  try {
    const { archetypeLabel, topRoast, oneLiner } = await request.json();

    const memePrompt = `girl roasting a guy's dating profile from a woman's perspective: he's a ${archetypeLabel}. ${topRoast}. ${oneLiner}. Make it from HER point of view, not his.`;

    const memeRes = await fetch("https://www.memelord.com/api/v1/ai-meme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${memelordKey}`,
      },
      body: JSON.stringify({ prompt: memePrompt, count: 1, include_nsfw: false }),
    });

    if (memeRes.ok) {
      const memeData = await memeRes.json();
      const memeUrl = memeData?.results?.[0]?.url as string | undefined;
      return NextResponse.json({ memeUrl: memeUrl ?? null });
    }
  } catch (e) {
    console.error("Meme generation failed:", e);
  }

  return NextResponse.json({ memeUrl: null });
}
