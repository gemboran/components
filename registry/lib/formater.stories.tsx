import {CustomMeta} from "@/registry/schema";
import {StoryObj} from "@storybook/react";
import {CodeSnippet} from "@/components/code-snippet";

export const CurrencyFormater: Story = {
  args: {
    code: `import {currencyFormater} from "@/lib/formater";\n\ncurrencyFormater(10000, "id-ID", "IDR");`,
    language: "typescript",
  }
}

export const DateFormater: Story = {
  args: {
    code: `import {currencyFormater} from "@/lib/formater";\n\ndateFormater(new Date(), "id-ID", {dateStyle: "medium"});`,
    language: "typescript",
  }
}

const meta: CustomMeta = {
  id: "lib/formater",
  title: "lib/Formater",
  component: CodeSnippet,
  block: {
    name: "lib/formater",
    type: "registry:lib",
    files: ["lib/formater.ts"]
  }
}

type Story = StoryObj<typeof meta>;

export default meta;