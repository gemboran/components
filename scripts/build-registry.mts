// originally from shadcn-ui
// https://github.com/shadcn-ui/ui/blob/main/apps/www/scripts/build-registry.mts
// noinspection ES6PreferShortImport

// @ts-nocheck
import { promises as fs, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import template from "lodash.template";
import { rimraf } from "rimraf";
import { Project, ScriptKind } from "ts-morph";
import type { z } from "zod";

import { registry } from "../registry";
import { baseColors } from "../registry/registry-base-colors";
import { colorMapping, colors } from "../registry/registry-colors";
import { styles } from "../registry/registry-styles";
import {
  type Registry,
  type RegistryEntry,
  registryEntrySchema,
  type registryItemTypeSchema,
  registrySchema,
} from "../registry/schema";

const REGISTRY_PATH = path.join(process.cwd(), "public/r");

const REGISTRY_INDEX_WHITELIST: z.infer<typeof registryItemTypeSchema>[] = [
  "registry:ui",
  "registry:lib",
  "registry:hook",
  "registry:theme",
  "registry:block",
];

const project = new Project({
  compilerOptions: {},
});

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"));
  return path.join(dir, filename);
}

// ----------------------------------------------------------------------------
// Build registry/styles/[style]/[name].json.
// ----------------------------------------------------------------------------
async function buildStyles(registry: Registry) {
  for (const style of styles) {
    const targetPath = path.join(REGISTRY_PATH, "styles", style.name);

    // Create directory if it doesn't exist.
    if (!existsSync(targetPath)) {
      await fs.mkdir(targetPath, { recursive: true });
    }

    for (const item of registry) {
      if (!REGISTRY_INDEX_WHITELIST.includes(item.type)) {
        continue;
      }

      let files;
      if (item.files) {
        files = await Promise.all(
          item.files.map(async (_file) => {
            const file =
              typeof _file === "string"
                ? {
                    path: _file,
                    type: item.type,
                    content: "",
                    target: "",
                  }
                : _file;

            const content = await fs.readFile(
              path.join(process.cwd(), "registry", style.name, file.path),
              "utf8",
            );

            const tempFile = await createTempSourceFile(file.path);
            const sourceFile = project.createSourceFile(tempFile, content, {
              scriptKind: ScriptKind.TSX,
            });

            sourceFile.getVariableDeclaration("iframeHeight")?.remove();
            sourceFile.getVariableDeclaration("containerClassName")?.remove();
            sourceFile.getVariableDeclaration("description")?.remove();

            return {
              path: file.path,
              type: file.type,
              content: sourceFile.getText(),
              target: file.target,
            };
          }),
        );
      }

      const payload = registryEntrySchema
        .omit({
          source: true,
          category: true,
          subcategory: true,
          chunks: true,
        })
        .safeParse({
          ...item,
          files,
        });

      if (payload.success) {
        await fs.writeFile(
          path.join(targetPath, `${item.name}.json`),
          JSON.stringify(payload.data, null, 2),
          "utf8",
        );
      }
    }
  }

  // ----------------------------------------------------------------------------
  // Build registry/styles/index.json.
  // ----------------------------------------------------------------------------
  const stylesJson = JSON.stringify(styles, null, 2);
  await fs.writeFile(
    path.join(REGISTRY_PATH, "styles/index.json"),
    stylesJson,
    "utf8",
  );
}

// ----------------------------------------------------------------------------
// Build registry/styles/[name]/index.json.
// ----------------------------------------------------------------------------
async function buildStylesIndex() {
  for (const style of styles) {
    const targetPath = path.join(REGISTRY_PATH, "styles", style.name);

    const payload: RegistryEntry = {
      name: style.name,
      type: "registry:style",
      dependencies: [
        "tailwindcss-animate",
        "class-variance-authority",
        "lucide-react",
        // TODO: Remove this when we migrate to lucide-react.
        style.name === "new-york" ? "@radix-ui/react-icons" : "",
      ],
      registryDependencies: ["utils"],
      tailwind: {
        config: {
          plugins: [`require("tailwindcss-animate")`],
        },
      },
      cssVars: {},
      files: [],
    };

    await fs.writeFile(
      path.join(targetPath, "index.json"),
      JSON.stringify(payload, null, 2),
      "utf8",
    );
  }
}

// ----------------------------------------------------------------------------
// Build registry/colors/index.json.
// ----------------------------------------------------------------------------
async function buildThemes() {
  const colorsTargetPath = path.join(REGISTRY_PATH, "colors");
  rimraf.sync(colorsTargetPath);
  if (!existsSync(colorsTargetPath)) {
    await fs.mkdir(colorsTargetPath, { recursive: true });
  }

  const colorsData: Record<string, any> = {};
  for (const [color, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      colorsData[color] = value;
      continue;
    }

    if (Array.isArray(value)) {
      colorsData[color] = value.map((item) => ({
        ...item,
        rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, "$1 $2 $3"),
        hslChannel: item.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          "$1 $2 $3",
        ),
      }));
      continue;
    }

    if (typeof value === "object") {
      colorsData[color] = {
        ...value,
        rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, "$1 $2 $3"),
        hslChannel: value.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          "$1 $2 $3",
        ),
      };
    }
  }

  await fs.writeFile(
    path.join(colorsTargetPath, "index.json"),
    JSON.stringify(colorsData, null, 2),
    "utf8",
  );

  // ----------------------------------------------------------------------------
  // Build registry/colors/[base].json.
  // ----------------------------------------------------------------------------
  const BASE_STYLES = `@tailwind base;
@tailwind components;
@tailwind utilities;
  `;

  const BASE_STYLES_WITH_VARIABLES = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: 0.5rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

  for (const baseColor of ["slate", "gray", "zinc", "neutral", "stone"]) {
    const base: Record<string, any> = {
      inlineColors: {},
      cssVars: {},
    };
    for (const [mode, values] of Object.entries(colorMapping)) {
      base.inlineColors[mode] = {};
      base.cssVars[mode] = {};
      for (const [key, value] of Object.entries(values)) {
         // Chart colors do not have a 1-to-1 mapping with tailwind colors.
        if (key.startsWith("chart-")) {
          base.cssVars[mode][key] = value;
          continue;
        }
        const resolvedColor = value.replace(/{{base}}-/g, `${baseColor}-`);
        base.inlineColors[mode][key] = resolvedColor;
        const [resolvedBase, scale] = resolvedColor.split("-");
        const color = scale
          ? colorsData[resolvedBase].find(
            (item: any) => item.scale === Number.parseInt(scale),
          )
          : colorsData[resolvedBase];
        if (color) {
          base.cssVars[mode][key] = color.hslChannel;
        }
      }
    }

    // Build css vars.
    base.inlineColorsTemplate = template(BASE_STYLES)({});
    base.cssVarsTemplate = template(BASE_STYLES_WITH_VARIABLES)({
      colors: base.cssVars,
    });

    await fs.writeFile(
      path.join(REGISTRY_PATH, `colors/${baseColor}.json`),
      JSON.stringify(base, null, 2),
      "utf8",
    );

    // ----------------------------------------------------------------------------
    // Build registry/themes.css
    // ----------------------------------------------------------------------------
    const THEME_STYLES_WITH_VARIABLES = `
.theme-<%- theme %> {
  --background: <%- colors.light["background"] %>;
  --foreground: <%- colors.light["foreground"] %>;

  --muted: <%- colors.light["muted"] %>;
  --muted-foreground: <%- colors.light["muted-foreground"] %>;

  --popover: <%- colors.light["popover"] %>;
  --popover-foreground: <%- colors.light["popover-foreground"] %>;

  --card: <%- colors.light["card"] %>;
  --card-foreground: <%- colors.light["card-foreground"] %>;

  --border: <%- colors.light["border"] %>;
  --input: <%- colors.light["input"] %>;

  --primary: <%- colors.light["primary"] %>;
  --primary-foreground: <%- colors.light["primary-foreground"] %>;

  --secondary: <%- colors.light["secondary"] %>;
  --secondary-foreground: <%- colors.light["secondary-foreground"] %>;

  --accent: <%- colors.light["accent"] %>;
  --accent-foreground: <%- colors.light["accent-foreground"] %>;

  --destructive: <%- colors.light["destructive"] %>;
  --destructive-foreground: <%- colors.light["destructive-foreground"] %>;

  --ring: <%- colors.light["ring"] %>;

  --radius: <%- colors.light["radius"] %>;
}

.dark .theme-<%- theme %> {
  --background: <%- colors.dark["background"] %>;
  --foreground: <%- colors.dark["foreground"] %>;

  --muted: <%- colors.dark["muted"] %>;
  --muted-foreground: <%- colors.dark["muted-foreground"] %>;

  --popover: <%- colors.dark["popover"] %>;
  --popover-foreground: <%- colors.dark["popover-foreground"] %>;

  --card: <%- colors.dark["card"] %>;
  --card-foreground: <%- colors.dark["card-foreground"] %>;

  --border: <%- colors.dark["border"] %>;
  --input: <%- colors.dark["input"] %>;

  --primary: <%- colors.dark["primary"] %>;
  --primary-foreground: <%- colors.dark["primary-foreground"] %>;

  --secondary: <%- colors.dark["secondary"] %>;
  --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;

  --accent: <%- colors.dark["accent"] %>;
  --accent-foreground: <%- colors.dark["accent-foreground"] %>;

  --destructive: <%- colors.dark["destructive"] %>;
  --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;

  --ring: <%- colors.dark["ring"] %>;
}`;

    const themeCSS = [];
    for (const theme of baseColors) {
      themeCSS.push(
        // @ts-ignore
        template(THEME_STYLES_WITH_VARIABLES)({
          colors: theme.cssVars,
          theme: theme.name,
        }),
      );
    }

    await fs.writeFile(
      path.join(REGISTRY_PATH, "themes.css"),
      themeCSS.join("\n"),
      "utf8",
    );

    // ----------------------------------------------------------------------------
    // Build registry/themes/[theme].json
    // ----------------------------------------------------------------------------
    rimraf.sync(path.join(REGISTRY_PATH, "themes"));
    for (const baseColor of ["slate", "gray", "zinc", "neutral", "stone"]) {
      const payload: Record<string, any> = {
        name: baseColor,
        label: baseColor.charAt(0).toUpperCase() + baseColor.slice(1),
        cssVars: {},
      };
      for (const [mode, values] of Object.entries(colorMapping)) {
        payload.cssVars[mode] = {};
        for (const [key, value] of Object.entries(values)) {
          const resolvedColor = value.replace(/{{base}}-/g, `${baseColor}-`);
          payload.cssVars[mode][key] = resolvedColor;
          const [resolvedBase, scale] = resolvedColor.split("-");
          const color = scale
            ? colorsData[resolvedBase].find(
              (item: any) => item.scale === Number.parseInt(scale),
            )
            : colorsData[resolvedBase];
          if (color) {
            payload.cssVars[mode][key] = color.hslChannel;
          }
        }
      }

      const targetPath = path.join(REGISTRY_PATH, "themes");

      // Create directory if it doesn't exist.
      if (!existsSync(targetPath)) {
        await fs.mkdir(targetPath, { recursive: true });
      }

      await fs.writeFile(
        path.join(targetPath, `${payload.name}.json`),
        JSON.stringify(payload, null, 2),
        "utf8",
      );
    }
  }
}

try {
  const result = registrySchema.safeParse(registry);

  if (!result.success) {
    console.error(result.error);
    process.exit(1);
  }

  await buildStyles(result.data);
  await buildStylesIndex();
  await buildThemes();

  console.log("✅ Done!");
} catch (error) {
  console.error(error);
  process.exit(1);
}
