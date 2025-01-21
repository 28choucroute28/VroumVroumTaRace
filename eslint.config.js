const html = require("eslint-plugin-html");

module.exports = [
  {
    files: ["*.html"],
    plugins: {
      html,
    },
    languageOptions: {
      parser: html,
    },
  },
];
