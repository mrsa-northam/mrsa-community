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

function compositeHex(foreground, background, alpha) {
  const foregroundChannels = foreground.slice(1).match(/.{2}/g).map((value) => parseInt(value, 16));
  const backgroundChannels = background.slice(1).match(/.{2}/g).map((value) => parseInt(value, 16));
  const channels = foregroundChannels.map((value, index) => Math.round(value * alpha + backgroundChannels[index] * (1 - alpha)));
  return `#${channels.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

const colors = {
  white: token("card"),
  blue50: token("blue-50"),
  blue300: token("blue-300"),
  blue500: token("blue-500"),
  blue700: token("blue-700"),
  blue900: token("blue-900"),
  surface: token("surface"),
  card: token("card"),
  ink: token("ink")
};

const checks = [
  ["white / blue-900 text", colors.white, colors.blue900, 4.5],
  ["ink / surface text", colors.ink, colors.surface, 4.5],
  ["ink / card text", colors.ink, colors.card, 4.5],
  ["blue-700 / card link text", colors.blue700, colors.card, 4.5],
  ["blue-700 / surface link text", colors.blue700, colors.surface, 4.5],
  ["blue-500 / card UI", colors.blue500, colors.card, 3],
  ["blue-300 / blue-900 UI", colors.blue300, colors.blue900, 3]
];

const onNavyMuted = compositeHex(colors.white, colors.blue900, 0.72);
checks.push(["72% white / blue-900 muted text", onNavyMuted, colors.blue900, 4.5]);

let failed = false;
for (const [label, foreground, background, minimum] of checks) {
  const ratio = contrast(foreground, background);
  const passed = ratio >= minimum;
  failed ||= !passed;
  console.log(`${passed ? "PASS" : "FAIL"} ${label}: ${ratio.toFixed(2)}:1 (minimum ${minimum}:1)`);
}

if (failed) process.exitCode = 1;
