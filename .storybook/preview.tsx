import "./globals.css";
import type {Preview} from "@storybook/react";
import {getRouter} from "@storybook/nextjs/router.mock";
import {withThemeByClassName} from "@storybook/addon-themes";
import DocTemplate from "./blocks/doc-template";

// noinspection JSUnusedGlobalSymbols
const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      page: DocTemplate
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