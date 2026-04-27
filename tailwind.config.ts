import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色：森林深绿
        crystal: {
          50:  "#f2f7f4",
          100: "#e0eee6",
          200: "#c1dece",
          300: "#94c5aa",
          400: "#61a681",
          500: "#3d8a61",
          600: "#2d6e4c",
          700: "#245940",
          800: "#1e4733",
          900: "#193b2b",
        },
        // 辅色：薄雾青灰（山水意境）
        mist: {
          50:  "#f5f8f7",
          100: "#deeae4",
          200: "#bed5c9",
          300: "#94b9a8",
          400: "#6a9987",
          500: "#4e7d6a",
          600: "#3c6455",
          700: "#325146",
          800: "#2a4239",
          900: "#243630",
        },
        // 点缀色：苔藓金/暖琥珀
        moss: {
          50:  "#faf8f0",
          100: "#f0ebd4",
          200: "#e1d5a8",
          300: "#cdb96f",
          400: "#bc9e46",
          500: "#a68432",
          600: "#8a6a28",
          700: "#6f5220",
          800: "#5a421c",
          900: "#4a3618",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
