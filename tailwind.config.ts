import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            lineHeight: "1.75",
            fontSize: "1.125rem",
            h1: {
              color: "#111827",
              fontSize: "2.25rem",
              fontWeight: "800",
              lineHeight: "1.2",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h2: {
              color: "#111827",
              fontSize: "1.875rem",
              fontWeight: "700",
              lineHeight: "1.3",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h3: {
              color: "#111827",
              fontSize: "1.5rem",
              fontWeight: "600",
              lineHeight: "1.4",
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
            },
            h4: {
              color: "#111827",
              fontSize: "1.25rem",
              fontWeight: "600",
              lineHeight: "1.5",
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
            },
            p: {
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
            },
            a: {
              color: "#2563eb",
              textDecoration: "underline",
              "&:hover": {
                color: "#1d4ed8",
              },
            },
            strong: {
              color: "#111827",
              fontWeight: "600",
            },
            ol: {
              listStyleType: "decimal",
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
              paddingLeft: "1.625rem",
            },
            ul: {
              listStyleType: "disc",
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
              paddingLeft: "1.625rem",
            },
            li: {
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            },
            "ol > li": {
              paddingLeft: "0.375rem",
            },
            "ul > li": {
              paddingLeft: "0.375rem",
            },
            blockquote: {
              fontWeight: "500",
              fontStyle: "italic",
              color: "#374151",
              borderLeftWidth: "0.25rem",
              borderLeftColor: "#d1d5db",
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: "1.6rem",
              marginBottom: "1.6rem",
              paddingLeft: "1rem",
            },
            "blockquote p:first-of-type::before": {
              content: "open-quote",
            },
            "blockquote p:last-of-type::after": {
              content: "close-quote",
            },
            code: {
              color: "#dc2626",
              fontWeight: "600",
              fontSize: "0.875rem",
              backgroundColor: "#f3f4f6",
              padding: "0.125rem 0.25rem",
              borderRadius: "0.25rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              color: "#e5e7eb",
              backgroundColor: "#1f2937",
              overflowX: "auto",
              fontSize: "0.875rem",
              lineHeight: "1.7142857",
              marginTop: "1.7142857em",
              marginBottom: "1.7142857em",
              borderRadius: "0.375rem",
              paddingTop: "0.8571429em",
              paddingRight: "1.1428571em",
              paddingBottom: "0.8571429em",
              paddingLeft: "1.1428571em",
            },
            "pre code": {
              backgroundColor: "transparent",
              borderWidth: "0",
              borderRadius: "0",
              padding: "0",
              fontWeight: "400",
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              lineHeight: "inherit",
            },
            img: {
              marginTop: "2rem",
              marginBottom: "2rem",
              borderRadius: "0.5rem",
            },
            table: {
              width: "100%",
              tableLayout: "auto",
              textAlign: "left",
              marginTop: "2em",
              marginBottom: "2em",
              fontSize: "0.875rem",
              lineHeight: "1.7142857",
            },
            thead: {
              borderBottomWidth: "1px",
              borderBottomColor: "#d1d5db",
            },
            "thead th": {
              color: "#111827",
              fontWeight: "600",
              verticalAlign: "bottom",
              paddingRight: "0.5714286em",
              paddingBottom: "0.5714286em",
              paddingLeft: "0.5714286em",
            },
            "tbody tr": {
              borderBottomWidth: "1px",
              borderBottomColor: "#e5e7eb",
            },
            "tbody tr:last-child": {
              borderBottomWidth: "0",
            },
            "tbody td": {
              verticalAlign: "baseline",
              paddingTop: "0.5714286em",
              paddingRight: "0.5714286em",
              paddingBottom: "0.5714286em",
              paddingLeft: "0.5714286em",
            },
          },
        },
        lg: {
          css: {
            fontSize: "1.25rem",
            lineHeight: "1.8",
            h1: {
              fontSize: "2.625rem",
              marginTop: "2.5rem",
              marginBottom: "1.25rem",
            },
            h2: {
              fontSize: "2.125rem",
              marginTop: "2.25rem",
              marginBottom: "1.125rem",
            },
            h3: {
              fontSize: "1.75rem",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h4: {
              fontSize: "1.375rem",
              marginTop: "1.75rem",
              marginBottom: "0.875rem",
            },
            p: {
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
