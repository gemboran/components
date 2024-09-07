import {hooks} from "./registry-hooks";
import {lib} from "./registry-lib";
import {themes} from "./registry-themes";
import type {Registry} from "./schema";
import path from "node:path";
import fg from "fast-glob";

async function importFromStories() {
  const blocks = [];
  const pattern = path.resolve("stories/{blocks,ui}/*.stories.tsx");
  const files = await fg(pattern);

  for (const file of files) {
    const meta = await import(file);
    blocks.push(meta.default.block)
  }
  return blocks as Registry;
}

const blocksAndUI = await importFromStories();

export const registry: Registry = [
  // eventually add your registries here
  ...blocksAndUI,
  ...hooks,
  ...lib,
  ...themes,
];
