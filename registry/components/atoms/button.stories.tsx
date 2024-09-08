// noinspection JSUnusedGlobalSymbols

import {StoryObj} from "@storybook/react";
import {LoginWithGoogle} from "@/components/atoms/button";
import {CustomMeta} from "@/registry/schema";

export const LoginWithGoogleButton: Story = {
  args: {
    onClick: () => {
      return
    },
  }
}

const meta: CustomMeta = {
  id: "atoms/button",
  title: "atoms/Button",
  component: LoginWithGoogle,
  block: {
    name: "atoms/button",
    type: "registry:component",
    registryDependencies: ["button"],
    files: ["components/atoms/button.tsx"],
  },
}

type Story = StoryObj<typeof meta>;

export default meta;
