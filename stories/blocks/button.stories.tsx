import {Meta, StoryObj} from "@storybook/react";
import LoginWithGoogle from "@/registry/default/atoms/login-with-google";
import {RegistryEntry} from "@/registry/schema";

export const Primary: Story = {
  args: {
    onClick: () => {
    },
  }
}

const meta: Meta & { block: RegistryEntry } = {
  block: {
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
  },
  title: "atoms/login-with-google",
  component: LoginWithGoogle,
}

type Story = StoryObj<typeof meta>;

export default meta;
