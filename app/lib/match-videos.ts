export const swingVisionMatchLinks: Record<string, string> = {
  "D1-005": "https://swing.vision/matches/sw2-Z1kvN3s",
  "D1-008": "https://swing.vision/matches/sw2-tsVu6B0",
  "D1-009": "https://swing.vision/matches/sw2-g4xRsZM",
  "D1-010": "https://swing.vision/matches/sw2-y0TEJP8",
  "D1-025": "https://swing.vision/matches/sw2-xhvzUEg"
};

export function getSwingVisionMatchUrl(publicMatchId: string) {
  return swingVisionMatchLinks[publicMatchId.toUpperCase()] || "";
}

export function getMatchVideoBrowserPath(publicMatchId: string) {
  return `/api/match-videos/${encodeURIComponent(publicMatchId.toUpperCase())}`;
}
