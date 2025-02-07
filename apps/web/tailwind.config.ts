/* eslint-disable @typescript-eslint/no-require-imports */
// tailwind config is required for editor support

import type { Config } from "tailwindcss";
const config: Pick<Config, "content" | "presets" | "plugins" | "theme"> = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "glow-conic":
          "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

export default config;
