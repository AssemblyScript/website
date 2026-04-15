import { GitContributors } from "/Volumes/Archive/Projects/Github/website/node_modules/@vuepress/plugin-git/dist/client/components/GitContributors.js";
import { GitChangelog } from "/Volumes/Archive/Projects/Github/website/node_modules/@vuepress/plugin-git/dist/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
