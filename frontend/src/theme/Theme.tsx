import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#e9fcf5" },
          100: { value: "#c4f6e2" },
          200: { value: "#9eeed0" },
          300: { value: "#78e7bd" },
          400: { value: "#4fe0aa" },
          500: { value: "#27a857" },
          600: { value: "#16a34a" },
          700: { value: "#04862b" },
          800: { value: "#086647" },
          900: { value: "#054033" },
        },
        secondary: {
          50: { value: "#fff7ed" },
          100: { value: "#ffedd5" },
          200: { value: "#fed7aa" },
          300: { value: "#fdba74" },
          400: { value: "#fb923c" },
          500: { value: "#f97316" },
          600: { value: "#ea580c" },
          700: { value: "#c2410c" },
          800: { value: "#9a3412" },
          900: { value: "#7c2d12" },
        },
        neutral: {
          50: { value: "#FFFFFF" },
          100: { value: "#F4F4F4" },
          200: { value: "#EEEEEE" },
          300: { value: "#E8E8E8" },
          400: { value: "#E2E2E2" },
          500: { value: "#DBDBDB" },
          600: { value: "#D5D5D5" },
          700: { value: "#CFCFCF" },
          800: { value: "#C9C9C9" },
          900: { value: "#C3C3C3" },
        },
        success: {
          500: { value: "#48bb78" },
        },
        error: {
          500: { value: "#f56565" },
        },
      },
      fontSizes: {
        lg: { value: "1.6em" },
        md: { value: "1.2em" },
      },
    },
  },
});
