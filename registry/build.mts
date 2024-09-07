import path from "node:path";
import {registryEntrySchema} from "./schema";
import fg from "fast-glob";
import {ensureFileSync} from "fs-extra";
import {readFile, writeFile} from "node:fs/promises";

const REGISTRY_PATH = path.resolve("public/r");

async function buildRegistry() {
  const pattern = path.resolve("registry/{blocks,ui}/*.stories.tsx");
  const files = await fg(pattern);

  for (const file of files) {
    const meta = await import(file);
    const {success, data: block, error} = registryEntrySchema.safeParse(meta.default.block);

    if (!success) {
      console.error(error);
      continue;
    }

    if (typeof block.files === "object" && block.files.length) {
      for (let file of block.files) {
        if (typeof file === "string") file = {
          path: file,
          type: block.type,
          content: await readFile(path.resolve(file), "utf8"),
          target: file,
        }
        else {
          file.content = await readFile(path.resolve(file.path), "utf8");
          file.target ??= file.path;
        }
      }
    }

    const filePath = path.join(REGISTRY_PATH, block.name + ".json")
    ensureFileSync(filePath);
    await writeFile(filePath, JSON.stringify(block, null, 2), "utf8");
  }
}

await buildRegistry();
