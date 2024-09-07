import type { Registry } from "./schema";

export const blocks: Registry = [
  {
    name: "atoms/login-with-google",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        type: "registry:component",
        path: "atoms/login-with-google.tsx",
        target: "components/atoms/login-with-google.tsx",
      }
    ],
  }
];

// see https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/registry-blocks.ts for examples
