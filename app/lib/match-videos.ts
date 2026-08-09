export const swingVisionMatchLinks: Record<string, string> = {
  "D1-002": "https://swing.vision/matches/sw2-WwBBKU4",
  "D1-005": "https://swing.vision/matches/sw2-Z1kvN3s",
  "D1-007": "https://swing.vision/matches/sw2-3ThVD7g",
  "D1-008": "https://swing.vision/matches/sw2-tsVu6B0",
  "D1-009": "https://swing.vision/matches/sw2-g4xRsZM",
  "D1-010": "https://swing.vision/matches/sw2-y0TEJP8",
  "D1-019": "https://swing.vision/matches/sw2-tXs3My4",
  "D1-024": "https://swing.vision/matches/sw2-GBur3Ss",
  "D1-025": "https://swing.vision/matches/sw2-xhvzUEg",
  "D1-028": "https://swing.vision/matches/sw2-YEcAVDc",
  "D1-036": "https://swing.vision/matches/sw2-Xv57Cyw",
  "D1-043": "https://swing.vision/matches/sw2-U7xNNac",
  "D1-044": "https://swing.vision/matches/sw2-VFjwGA8",
  "D1-045": "https://swing.vision/matches/sw2-112AbSM",
  "D1-059": "https://swing.vision/matches/sw2-2fcRqeM",
  "D2-QF2-01": "https://swing.vision/matches/sw2-fEEAPkw"
};

export function getSwingVisionMatchUrl(publicMatchId: string) {
  return swingVisionMatchLinks[publicMatchId.toUpperCase()] || "";
}

export function getMatchVideoBrowserPath(publicMatchId: string) {
  return `/api/match-videos/${encodeURIComponent(publicMatchId.toUpperCase())}`;
}
