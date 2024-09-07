import {Meta, StoryObj} from "@storybook/react";
import {LoginWithGoogle} from "@/components/atoms/button";
import {RegistryEntry} from "@/registry/schema";

export const LoginWithGoogleButton: Story = {
  args: {
    onClick: () => {
      return
    },
  }
}

const meta: Meta & { block: RegistryEntry } = {
  title: "atoms/Button",
  component: LoginWithGoogle,
  id: "atoms/button",
  block: {
    name: "atoms/button",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        type: "registry:component",
        path: "components/atoms/button.tsx",
        target: "components/atoms/button.tsx",
      }
    ],
  },
}

type Story = StoryObj<typeof meta>;

export default meta;
