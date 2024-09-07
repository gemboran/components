import "../app/globals.css";
import type { Preview } from "@storybook/react";
import {Description, Title} from "@storybook/blocks";
import {getRouter} from "@storybook/nextjs/router.mock";
import { withThemeByClassName } from "@storybook/addon-themes";
import {TerminalCommandBlock} from "./blocks/terminal-command.block";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      page: () => {
        return (
          <>
            <Title />
            <Description />
            <TerminalCommandBlock />
          </>
        );
      },
    },
    nextjs: {
      router: {
        basePath: "/app/",
      },
      appDirectory: true,
    },
  },

  async beforeEach() {
    getRouter().push.mockImplementation(() => {});
  },

  decorators: [withThemeByClassName({
      themes: {
          system: 'system',
          light: 'light',
          dark: 'dark',
      },
      defaultTheme: 'system',
  })]
};

export default preview;
