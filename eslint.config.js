const htmlPlugin = require("eslint-plugin-html");

module.exports = {
  overrides: [
    {
      files: ["*.html"],
      parser: "eslint-plugin-html", // Utilise eslint-plugin-html pour parser le HTML
      plugins: ["html"], // Assure-toi que le plugin html est ajouté
      rules: {
        // Tu peux ajouter des règles spécifiques ici
      },
    },
  ],
};

