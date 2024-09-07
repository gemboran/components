import "../app/globals.css";
import type { Preview } from "@storybook/react";
import {Controls, Description, Primary, Stories, Subtitle, Title} from "@storybook/blocks";
import {getRouter} from "@storybook/nextjs/router.mock";
import { withThemeByClassName } from "@storybook/addon-themes";
import {TerminalCommandBlock} from "./blocks/terminal-command.block";

// noinspection JSUnusedGlobalSymbols
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
            <Subtitle />
            <Description />
            <TerminalCommandBlock />
            <Primary />
            <Controls />
            <Stories />
          </>
        );
      },
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
  })],

  tags: ["autodocs"],
};

export default preview;