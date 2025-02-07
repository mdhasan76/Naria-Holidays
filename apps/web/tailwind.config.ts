/* eslint-disable @typescript-eslint/no-require-imports */
// tailwind config is required for editor support
const flowbite = require("flowbite-react/tailwind");
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "plugins"> = {
  content: ["./app/**/*.tsx", flowbite.content()],

  plugins: [
    // ...
    flowbite.plugin(),
  ],
};

export default config;
