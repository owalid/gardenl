const fs = require('fs')
const base_species = require('./base_species.json')
const data_agrihack_specie_and_type = require('./data_agrihack_specie_and_type.json')


// {
//   "Espèces": "Aubergine", 0
//   "Variétés": "blanche Dourga", 1
//   "URL": "https://www.germinance.com/boutique/legumes_fruits-aubergine_blanche_dourga-article-AUD.awp?pgnIdCategorie=32", 2
//   "Famille": "Solanacées", 3
//   "Durée au champ en jours": 120, 4
//   "Préparation sol": null, 5
//   "Temps (s)": 1800, 6
//   "Fertilisation": "Forte", 7
//   "Temps (s).1": 1200, 8
//   "Implantation": "Bache ; Plants ; Serre ; Tuteur", 9
//   "Temps (s).2": 3600, 10
//   "Entretien": "Tuteurage ; Effueillage", 11
//   "Temps (s).3": 3600, 12
//   "Désherbage": "-", 13
//   "Unnamed: 14": null, 14
//   "Irrigation": "Compte goutte", 15
//   "Temps pose (s)": 2400, 16
//   "Protection": null,  17
//   "Unnamed: 18": null,   18
//   "Récolte": "Individuel", 19
//   "secondes/planches (de 16 m²)": 4902, 20
//   "Nettoyage/Condi": 0, 21
//   "Conditionnement": "6-10° 90% humidité", 22
//   "Unnamed: 23": null, 23
//   "Rendement (€/planche)": "268,32"  24
// },

const main = () => {
  const final_result = [...base_species]
  let i = 0
  base_species.forEach((specie, indexSpecie) => {
    specie.types.forEach((type, indexType) => {
      const keys_data_agrihack = Object.keys(data_agrihack_specie_and_type[i])
      const values_data_agrihack = Object.values(data_agrihack_specie_and_type[i])
      final_result[indexSpecie].types[indexType] =  {
        ...final_result[indexSpecie].types[indexType],
        field_time: values_data_agrihack[4],
        ground_preparation: values_data_agrihack[5],
        time_preparation: values_data_agrihack[6],
        time_fertilization: values_data_agrihack[8],
        implantation: values_data_agrihack[9],
        time_implantation: values_data_agrihack[10],
        maintenance: values_data_agrihack[11],
        time_maintenance: values_data_agrihack[12],
        weed_control: values_data_agrihack[13],
        time_irrigation: values_data_agrihack[16],
        harvest: values_data_agrihack[19],
        seconds_by_plank: values_data_agrihack[20],
        time_cleaning: values_data_agrihack[21],
        packaging: values_data_agrihack[22],
        yield_by_plank: values_data_agrihack[24],
        quantity: 0,
        index: i
      }
      i++;
    })
  });
  fs.writeFileSync('links_species.json', JSON.stringify(final_result, null, 4))
}

main()