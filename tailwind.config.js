/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                    dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
                    light: 'rgb(var(--color-primary-light) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: '#10B981',
                },
                background: 'rgb(var(--color-background) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                text: {
                    primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
                    light: 'rgb(var(--color-text-light) / <alpha-value>)',
                },
                border: 'rgb(var(--color-border) / <alpha-value>)',
                error: '#EF4444',
            },
            fontFamily: {
                // basic font stack
                sans: ['System'],
            },
            spacing: {
                xs: '4px',
                s: '8px',
                m: '16px',
                l: '24px',
                xl: '32px',
                xxl: '48px',
            },
        },
    },
    plugins: [],
}