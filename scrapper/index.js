const puppeteer = require('puppeteer');
const fs = require('fs')
const final_results = require('./links_species.json')

const line_semis = '.ligne-semis > td'
const line_recolte = '.ligne-recolte > td'

const getMonthStartEndSemis = (elmts) => {
  const month_start_semis = `${elmts.findIndex(elmt => elmt._remoteObject.description === 'td.debut-semis') + 1}`.padStart(2, '0');
  const month_end_semis = `${elmts.findIndex(elmt => elmt._remoteObject.description === 'td.fin-semis') + 1}`.padStart(2, '0');
  return { month_start_semis, month_end_semis };
}

const getMonthStartEndRecolte = (elmts) => {
  const month_start_recolte = `${elmts.findIndex(elmt => elmt._remoteObject.description === 'td.debut-recolte') + 1}`.padStart(2, '0');
  const month_end_recolte = `${elmts.findIndex(elmt => elmt._remoteObject.description === 'td.fin-recolte') + 1}`.padStart(2, '0');
  return { month_start_recolte, month_end_recolte };
}

const main = async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await page.goto("https://www.germinance.com/boutique/vente-semences_potageres-32.awp", {waitUntil: 'networkidle2'});

  for (let index_specie = 0; index_specie < final_results.length; ++index_specie) {
    const {types}  = final_results[index_specie];
    for (let index_type = 0; index_type < types.length; ++index_type) {
      await page.goto(types[index_type].link, {waitUntil: 'networkidle2'});
      await page.waitForSelector(line_semis)

      let complete_name = await page.$('h1')
      complete_name = await page.evaluate(el => el.textContent, complete_name)
      console.log("complete_name", complete_name)


      let spacing = await page.$('#A94')
      spacing = await page.evaluate(el => el.textContent.trim(), spacing)

      let descriptions = await page.$('#A15')
      const description = await page.evaluate(el => el.textContent, descriptions)
      console.log("description", description)
      
      let image = await page.$$('img')
      image = image[3]
      let src_img = await page.evaluate(el => el.src, image)
      src_img = src_img.replace('_mini', '')

      let elmts_semis = await page.$$(line_semis)
      elmts_semis = [...elmts_semis]
      elmts_semis.shift()
      const start_end_months_semis = getMonthStartEndSemis(elmts_semis)

      let elmts_recolte = await page.$$(line_recolte)
      elmts_recolte = [...elmts_recolte]
      elmts_recolte.shift()
      const start_end_months_recolte = getMonthStartEndRecolte(elmts_recolte)

      final_results[index_specie].types[index_type] = {...final_results[index_specie].types[index_type], ...start_end_months_semis, ...start_end_months_recolte, src_img, complete_name, description, spacing}
      delete final_results[index_specie].types[index_type].link;
      await page.goBack();
      await page.waitFor(1000)
    }
  }
  fs.writeFileSync('result.json', JSON.stringify(final_results, null, 4))
}

main()
