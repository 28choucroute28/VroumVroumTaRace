const { test, expect } = require('@playwright/test');

test('Utilisateur sélectionne une voiture', async ({ page }) => {
  // 1. Aller sur la page du site où se trouve le formulaire
  await page.goto('http://127.0.0.1:8080');
  await page.waitForTimeout(1000);

  // Sélectionner "Abarth" dans la liste des marques
  await page.selectOption('#make-select', { label: 'Abarth' });
  await page.waitForTimeout(500);

  // Sélectionner "1000" dans la liste des modèles
  await page.selectOption('#model-select', { label: '1000' });
  await page.waitForTimeout(500);

  // Sélectionner "1960" dans la liste des années
  await page.selectOption('#year-select', { label: '1960' });
  await page.waitForTimeout(500);

  // Cliquer sur le bouton "Search"
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);	
  
  // Vérifier si des résultats sont disponibles
  const results = await page.$$('#results .result-item');

  if (results.length > 0) {
    console.log(`Nombre de résultats trouvés : ${results.length}`);

    // Cliquer sur le premier bouton "View Details"
    const viewDetailsButton = await results[0].$('button.view-details');
    if (viewDetailsButton) {
      await viewDetailsButton.click();
      await page.waitForTimeout(1000);

      // Vérifier et afficher les détails du véhicule
      const details = await page.textContent('#vehicle-details');
      console.log('Détails du véhicule :');
      console.log(details);
    } else {
      console.log('Le bouton "View Details" n\'est pas disponible.');
    }
  } else {
    console.log('Aucun résultat trouvé après avoir cliqué sur "Search".');
  }
});
