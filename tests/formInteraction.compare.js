const { test, expect } = require('@playwright/test');

test('Comparaison de deux véhicules sur la page compare.html', async ({ page }) => {
  // 1. Aller sur la page de comparaison
  await page.goto('http://127.0.0.1:8080/compare.html');
  await page.waitForTimeout(1000);

  // 2. Sélectionner une marque pour le premier véhicule
  await page.selectOption('#make-1', { label: 'Abarth' });
  await page.waitForTimeout(500);

  // 3. Sélectionner un modèle pour le premier véhicule
  await page.selectOption('#model-1', { label: '1000' });
  await page.waitForTimeout(500);

  // 4. Sélectionner une année pour le premier véhicule
  await page.selectOption('#year-1', { label: '1960' });
  await page.waitForTimeout(500);

  // 5. Sélectionner une finition (trim) pour le premier véhicule
  await page.selectOption('#trim-1', { label: 'Base' });
  await page.waitForTimeout(500);

  // 6. Répéter les étapes pour le deuxième véhicule
  await page.selectOption('#make-2', { label: 'Alfa Romeo' });
  await page.waitForTimeout(500);

  await page.selectOption('#model-2', { label: 'Giulia' });
  await page.waitForTimeout(500);

  await page.selectOption('#year-2', { label: '2020' });
  await page.waitForTimeout(500);

  await page.selectOption('#trim-2', { label: 'Quadrifoglio' });
  await page.waitForTimeout(500);

  // 7. Cliquer sur le bouton "Compare"
  await page.click('#compare-btn');
  await page.waitForTimeout(1000);

  // 8. Vérifier si les résultats de la comparaison sont affichés
  const comparisonResults = await page.$('#comparison-results');
  if (comparisonResults) {
    const text = await comparisonResults.textContent();
    console.log('Résultats de la comparaison :');
    console.log(text);

    // Optionnel : Vérifier qu'un élément attendu est présent
    expect(text).toContain('Sporty Score'); // Exemple de vérification
  } else {
    console.log('Les résultats de la comparaison ne sont pas affichés.');
  }
});

