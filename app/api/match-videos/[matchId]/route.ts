import { getSwingVisionMatchUrl } from "../../../lib/match-videos";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET(_request: Request, context: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await context.params;
  const publicMatchId = decodeURIComponent(matchId).toUpperCase();
  const swingVisionUrl = getSwingVisionMatchUrl(publicMatchId);

  if (!swingVisionUrl) {
    return new Response("Match video not found.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const safeUrl = escapeHtml(swingVisionUrl);
  const safeMatchId = escapeHtml(publicMatchId);
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=${safeUrl}">
    <title>Opening ${safeMatchId} match video</title>
    <style>
      body { align-items: center; background: #f4f7fb; color: #16212e; display: grid; font-family: ui-sans-serif, system-ui, sans-serif; justify-items: center; margin: 0; min-height: 100vh; padding: 24px; text-align: center; }
      main { background: white; border: 1px solid #dce7f5; border-radius: 24px; box-shadow: 0 18px 42px rgba(14, 42, 71, .10); max-width: 420px; padding: 32px; }
      strong { color: #0e2a47; display: block; font-size: 22px; margin-bottom: 8px; }
      p { color: #64748b; line-height: 1.5; margin: 0; }
      a { color: #2f6fab; display: inline-block; font-weight: 700; margin-top: 18px; }
    </style>
  </head>
  <body>
    <main>
      <strong>Opening ${safeMatchId}</strong>
      <p>Loading the SwingVision recording in your web browser.</p>
      <a href="${safeUrl}">Continue to the recording</a>
    </main>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
