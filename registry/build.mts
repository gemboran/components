import path from "node:path";
import {registryEntrySchema} from "./schema";
import fg from "fast-glob";
import {ensureFileSync} from "fs-extra";
import {readFile, writeFile} from "node:fs/promises";

const REGISTRY_PATH = path.resolve("public/r");

async function buildRegistry() {
  const pattern = path.resolve("registry/**/*.stories.tsx");
  const files = await fg(pattern);

  for (const file of files) {
    const meta = await import(file);
    const {success, data: block, error} = registryEntrySchema.safeParse(meta.default.block);

    if (!success) {
      console.error(error);
      continue;
    }

    if (typeof block.files === "object" && block.files.length) {
      const files = [];
      for (const item of block.files) {
        const file = typeof item === "string" ? {
          path: item,
          type: block.type,
          content: await readFile(path.resolve(item), "utf8"),
          target: item,
        } : {
          ...item,
          content: await readFile(path.resolve(item.path), "utf8"),
          target: item.target || item.path
        }
        files.push(file);
      }

      block.files = files;
    }

    const filePath = path.join(REGISTRY_PATH, block.name + ".json")
    ensureFileSync(filePath);
    await writeFile(filePath, JSON.stringify(block, null, 2), "utf8");
  }
}

await buildRegistry();
