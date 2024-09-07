import {Meta, StoryObj} from "@storybook/react";
import {LoginWithGoogle} from "@/registry/default/atoms/button";
import {RegistryEntry} from "@/registry/schema";

export const LoginWithGoogleButton: Story = {
  args: {
    onClick: () => {
      return
    },
  }
}

const meta: Meta & { block: RegistryEntry } = {
  block: {
    name: "atoms/button",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        type: "registry:component",
        path: "atoms/button.tsx",
        target: "components/atoms/button.tsx",
      }
    ],
  },
  id: "atoms/button",
  title: "atoms/Button",
  component: LoginWithGoogle,
}

type Story = StoryObj<typeof meta>;

export default meta;
