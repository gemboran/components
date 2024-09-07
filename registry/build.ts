import { readFile, writeFile } from "fs/promises";
import { RegistryEntry } from "./schema";
import registryConfig from ".";
import chalk from "chalk";

console.log("Building registry...");

async function build() {
  for (const registryData of registryConfig) {
    const registry = registryData as RegistryEntry;

    registry.files = registry.files || [];

    for (const file of registry.files) {
      if (typeof file === "string") {
        const content = await readFile(`./${file}`, "utf-8");
        registry.files = registry.files.filter((f) => f !== file);
        registry.files.push({
          path: file,
          content,
          type: "registry:ui",
        });
      }
    }

    await writeFile(`./public/r/${registry.name}.json`, JSON.stringify(registry, null, 2));

    console.log(`Registry built for ${chalk.green.bold(registry.name)}`);
  }
}

// noinspection JSIgnoredPromiseFromCall
build();
