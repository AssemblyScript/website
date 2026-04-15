import { CodeTabs } from "/Volumes/Archive/Projects/Github/website/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/CodeTabs.js";
import { Tabs } from "/Volumes/Archive/Projects/Github/website/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/Tabs.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
