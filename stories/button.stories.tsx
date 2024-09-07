import type { Meta, StoryObj } from "@storybook/react";
import {Button} from "@/components/ui/button";
import {HIDE} from "@/stories/consts";

const meta: Meta<typeof Button> = {
  id: "button",
  title: "Components/UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    asChild: HIDE
  },
}

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  }
}

export default meta;
