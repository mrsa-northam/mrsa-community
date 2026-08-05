import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../app/globals.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");

function token(name) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!match) throw new Error(`Missing color token --${name}`);
  return match[1];
}

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
  const [red, green, blue] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const colors = {
  white: token("card"),
  brandDeep: token("brand-deep"),
  brandPrimary: token("brand-primary"),
  brandPrimaryText: token("brand-primary-text"),
  surface: token("surface"),
  card: token("card"),
  accent: token("accent"),
  accentInk: token("accent-ink"),
  urgent: token("urgent"),
  urgentInk: token("urgent-ink"),
  ink: token("ink")
};

const checks = [
  ["white / brand-deep text", colors.white, colors.brandDeep, 4.5],
  ["ink / surface text", colors.ink, colors.surface, 4.5],
  ["ink / card text", colors.ink, colors.card, 4.5],
  ["accent-ink / accent text", colors.accentInk, colors.accent, 4.5],
  ["urgent-ink / urgent text", colors.urgentInk, colors.urgent, 4.5],
  ["brand-primary-text / card text", colors.brandPrimaryText, colors.card, 4.5],
  ["brand-primary-text / surface text", colors.brandPrimaryText, colors.surface, 4.5],
  ["brand-primary / card UI", colors.brandPrimary, colors.card, 3]
];

let failed = false;
for (const [label, foreground, background, minimum] of checks) {
  const ratio = contrast(foreground, background);
  const passed = ratio >= minimum;
  failed ||= !passed;
  console.log(`${passed ? "PASS" : "FAIL"} ${label}: ${ratio.toFixed(2)}:1 (minimum ${minimum}:1)`);
}

if (failed) process.exitCode = 1;
