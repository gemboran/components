import {Meta, StoryObj} from "@storybook/react";
import LoginWithGoogle from "@/registry/default/atoms/login-with-google";

const meta: Meta = {
  title: 'atoms/login-with-google',
  component: LoginWithGoogle,
}

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onClick: () => {},
  }
}

export default meta;
