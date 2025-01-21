import html from "eslint-plugin-html";

export default {
  plugins: [html],
  overrides: [
    {
      files: ["*.html"],
      processor: "html/html",
    },
  ],
};
