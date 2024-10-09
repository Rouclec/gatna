import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        readex: ["Readex Pro", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          "500": "#1D1B27",
          "450": "#8749D4",
          "400": "#8150ED",
          "300": "#0C6CF2",
          "200": "#312F3C",
        },
        neutral: {
          "10": "#ffffff",
          "24": "#FFFFFF24",
          "21": "#FFFFFF21",
          "30": "#ffffff30",
          "66": "#FFFFFF66",
          "50": "#f5f5f5",
          "1A": "#FFFFFF1A",
          "1A40": "#FFFFFF0A",
          B2: "#FFFFFFB2",
          "CC": "#FFFFFFCC"
        },
        dark: {
          "00": "#00000000",
          "0": "#000000",
          "30": "#00000030",
          "33": "#00000033",
          "4D": "#0000004D",
          "14": "#462FCF14",
          "1A": " #0000001A",
        },
        grey: {
          bg: "#A6A6A61A",
          "50": "#D9D9D91A",
          "60": "#D9D9D9",
          "9333": "#93939333",
          "text": "#D4DFE9",
          "D933": "#D9D9D933",
          "920D": "#929EB10D"
        },
        telegram: "#0C6CF2",
        whatsapp: "#14A42B",
        outline: "#CFB4F133",
        error: "#E03A31",
        green: "#77E8C9",
        blue: "#452ECE",
        blue14: "#462FCF14"
      },
      screens: {
        xs: "480px", // Extra small devices (mobile phones)
        sm: "768px", // Small devices (tablets and large phones)
        md: "1024px", // Medium devices (smaller laptops, tablets in landscape)
        lg: "1440px", // Large devices (laptops, desktops)
        xl: "1920px",
      },
    },
  },
  plugins: [],
};
export default config;
