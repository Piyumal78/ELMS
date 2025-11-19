/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",  // only JS + JSX since you’re not using TypeScript
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
