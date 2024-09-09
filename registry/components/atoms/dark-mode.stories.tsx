// noinspection JSUnusedGlobalSymbols

import {StoryObj} from "@storybook/react";
import {CustomMeta} from "@/registry/schema";
import {ToggleDarkMode} from "@/components/atoms/dark-mode";

export const ToggleButton: Story = {
  args: {},
}

const meta: CustomMeta = {
  id: "atoms/dark-mode",
  title: "atoms/DarkMode",
  component: ToggleDarkMode,
  block: {
    name: "atoms/dark-mode",
    type: "registry:component",
    dependencies: ["next-themes"],
    registryDependencies: [
      "button",
      "dropdown-menu",
    ],
    files: [
      "components/theme-provider.tsx",
      "components/atoms/dark-mode.tsx",
    ],
  },
}

type Story = StoryObj<typeof meta>;

export default meta;