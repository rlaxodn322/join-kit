import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EBF2FE",
          100: "#D6E4FD",
          200: "#ADC8FB",
          300: "#84ADF9",
          400: "#5B91F7",
          500: "#3182F6",
          600: "#1B64DA",
          700: "#1550B2",
          800: "#0F3D89",
          900: "#0A2961",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F2F4F6",
          200: "#E5E8EB",
          300: "#D1D6DB",
          400: "#B0B8C1",
          500: "#8B95A1",
          600: "#6B7684",
          700: "#4E5968",
          800: "#333D4B",
          900: "#191F28",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      fontSize: {
        "heading-1": ["28px", { lineHeight: "38px", fontWeight: "700" }],
        "heading-2": ["24px", { lineHeight: "34px", fontWeight: "700" }],
        "heading-3": ["20px", { lineHeight: "30px", fontWeight: "600" }],
        "body-1": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-2": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "18px", fontWeight: "400" }],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)",
        modal:
          "0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
