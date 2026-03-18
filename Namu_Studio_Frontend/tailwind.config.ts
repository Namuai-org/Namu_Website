import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          panel: "var(--bg-panel)",
          elevated: "var(--bg-elevated)",
          active: "var(--bg-active)"
        },
        surface: {
          base: "var(--surface-base)",
          off: "var(--surface-off)",
          card: "var(--surface-card)"
        },
        brand: {
          orange: "var(--orange)",
          hover: "var(--orange-hover)",
          deep: "var(--orange-deep)",
          pale: "var(--orange-pale)",
          glow: "var(--orange-glow)",
          subtle: "var(--orange-subtle)",
          navy: "var(--navy)",
          mid: "var(--navy-mid)"
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          dark: "var(--text-dark)",
          body: "var(--text-body)",
          quiet: "var(--text-quiet)"
        },
        border: {
          DEFAULT: "var(--border)",
          bright: "var(--border-bright)",
          light: "var(--border-light)"
        },
        status: {
          success: "var(--success)",
          warning: "var(--warning)",
          error: "var(--error)",
          info: "var(--info)"
        },
        syntax: {
          tag: "var(--syn-tag)",
          attr: "var(--syn-attr)",
          string: "var(--syn-string)",
          comment: "var(--syn-comment)",
          keyword: "var(--syn-keyword)",
          number: "var(--syn-number)",
          fn: "var(--syn-fn)"
        }
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)"
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        orange: "var(--shadow-orange)"
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
        mono: ["var(--font-jetbrains-mono)"]
      },
      fontSize: {
        xs: "var(--font-xs)",
        sm: "var(--font-sm)",
        base: "var(--font-base)",
        md: "var(--font-md)",
        lg: "var(--font-lg)",
        xl: "var(--font-xl)",
        "2xl": "var(--font-2xl)",
        "3xl": "var(--font-3xl)",
        hero: "var(--font-hero)"
      },
      transitionTimingFunction: {
        spring: "var(--ease-spring)",
        smooth: "var(--ease-smooth)"
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)"
      },
      height: {
        header: "56px",
        status: "24px"
      },
      width: {
        sidebar: "56px",
        "sidebar-expanded": "240px"
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" }
        },
        bounceDot: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-6px)", opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        pulseVoice: {
          "0%": {
            boxShadow: "0 0 0 0 rgba(214,112,63,0.4), 0 0 0 0 rgba(214,112,63,0.2)"
          },
          "100%": {
            boxShadow: "0 0 0 20px rgba(214,112,63,0), 0 0 0 40px rgba(214,112,63,0)"
          }
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" }
        }
      },
      animation: {
        shake: "shake 400ms var(--ease-spring)",
        bounceDot: "bounceDot 900ms infinite",
        shimmer: "shimmer 1.5s infinite",
        pulseVoice: "pulseVoice 1.5s infinite",
        blink: "blink 1s step-end infinite"
      }
    }
  },
  plugins: []
};

export default config;
