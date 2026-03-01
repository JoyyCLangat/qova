import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

function getConvex(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url);
}

function getGradeColor(score: number): { bg: string; text: string } {
  if (score >= 700) return { bg: "#166534", text: "#22C55E" };
  if (score >= 400) return { bg: "#713f12", text: "#FACC15" };
  return { bg: "#7f1d1d", text: "#EF4444" };
}

function getGrade(score: number): string {
  if (score >= 950) return "AAA";
  if (score >= 900) return "AA";
  if (score >= 850) return "A";
  if (score >= 750) return "BBB";
  if (score >= 650) return "BB";
  if (score >= 550) return "B";
  if (score >= 450) return "CCC";
  if (score >= 350) return "CC";
  if (score >= 250) return "C";
  return "D";
}

function renderBadge(score: number, grade: string): string {
  const { bg, text } = getGradeColor(score);
  const labelWidth = 72;
  const valueWidth = 56;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="Qova: ${grade} ${score}">
  <title>Qova: ${grade} ${score}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#1a1a1a"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${bg}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelWidth / 2}" y="14" fill="#ddd">qova score</text>
    <text x="${labelWidth + valueWidth / 2}" y="14" fill="${text}">${grade} ${score}</text>
  </g>
</svg>`;
}

function renderFallbackBadge(): string {
  const labelWidth = 72;
  const valueWidth = 56;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="Qova: N/A">
  <title>Qova: not found</title>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#1a1a1a"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#555"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelWidth / 2}" y="14" fill="#ddd">qova score</text>
    <text x="${labelWidth + valueWidth / 2}" y="14" fill="#aaa">N/A</text>
  </g>
</svg>`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> },
): Promise<Response> {
  const { address } = await params;

  const headers = {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "public, max-age=300, s-maxage=300",
  };

  const convex = getConvex();
  if (!convex) {
    return new Response(renderFallbackBadge(), { headers });
  }

  try {
    const agent = await convex.query(api.queries.agents.getByAddress, {
      address,
    });

    if (!agent) {
      return new Response(renderFallbackBadge(), { headers });
    }

    const grade = getGrade(agent.score);
    return new Response(renderBadge(agent.score, grade), { headers });
  } catch {
    return new Response(renderFallbackBadge(), { headers });
  }
}
