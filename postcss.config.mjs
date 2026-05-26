// Source: https://tailwindcss.com/docs/installation/framework-guides/nextjs (v4)
// Tailwind v4 handles autoprefixer + postcss-import internally — do NOT add them.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
