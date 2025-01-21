const { test, expect } = require('@playwright/test');

test('Utilisateur sélectionne une voiture', async ({ page }) => {
  // 1. Aller sur la page du site où se trouve le formulaire
  await page.goto('http://localhost:8080'); // Remplace l'URL par celle de ton site

  // 2. Sélectionner une marque, un modèle et une année (ajuste les sélecteurs en fonction de ton HTML)
  await page.selectOption('select[name="make"]', 'Dodge'); // Remplace par l'élément exact pour la marque
  await page.selectOption('select[name="model"]', 'Viper'); // Remplace par l'élément exact pour le modèle
  await page.selectOption('select[name="year"]', '2009'); // Remplace par l'élément exact pour l'année

  // 3. Cliquer sur le bouton pour soumettre la sélection
  await page.click('button[type="submit"]'); // Ajuste selon ton bouton de soumission

  // 4. Vérifier qu'une voiture avec le nom 'Viper' et l'année '2009' apparaît (ou un autre critère)
  const carInfo = await page.innerText('.car-info'); // Remplace .car-info par l'élément qui affiche la voiture sélectionnée
  expect(carInfo).toContain('Dodge Viper 2009'); // Vérifie que l'élément contient le nom et l'année de la voiture

  // 5. Optionnellement, tu peux vérifier plus de détails sur la voiture
  const carDetails = await page.innerText('.car-details'); // Remplace par le sélecteur réel pour les détails
  expect(carDetails).toContain('SRT-10'); // Vérifie un autre détail de la voiture
});
