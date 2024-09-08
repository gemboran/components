import {addons} from "@storybook/manager-api";
import {create} from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "UI Buatan",
    brandUrl: "https://ui.buatan.id",
    brandImage: "/logo.png",
    brandTarget: '_self',
    fontCode: "monospace",
  }),
})