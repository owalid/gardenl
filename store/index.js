import dataSpecies from '~/data/dataSpecies.json';


export const getters = {
  getPlanificationRaw(state, getters) {
    /*
      return object of array[n] of array[3] of objects
      n is size number of gardens or greenhouses
      3 is size of plank

      Example:
      {
        gardens: [ (size n)
          [ // plank 1 (size 3)
            {
              index
              month_start_recolte
              month_end_recolte
              month_start_semis
              month_end_semis
              specie_name
              garden
              uuid
            }
            {
              index
              month_start_recolte
              month_end_recolte
              month_start_semis
              month_end_semis
              specie_name
              garden
              uuid
            }
          ]
        ],
        greenhouse: []
      }
    */
   
    const res = {
      gardens: [],
      greenhouse: []
    }
    dataSpecies
        // filter by selected specie and get minimal data
        .map(specie => specie.types
                              .filter(type => state.speciesSelected.find(specieSelected => specieSelected.index === type.index))
                              .map(type => {
                                const result = []
                                const {quantity} = state.speciesSelected.find(specieSelected => specieSelected.index === type.index)
                                for (let i=0; i < quantity; i++) {
                                  result.push({
                                    index: type.index,
                                    month_start_recolte: type.month_start_recolte,
                                    month_end_recolte: type.month_end_recolte,
                                    month_start_semis: type.month_start_semis,
                                    month_end_semis: type.month_end_semis,
                                    specie_name: specie.specie_index,
                                    garden: type.garden,
                                    fertilization: type.fertilization,
                                    uuid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                                  })
                                }
                                console.log("result", result);
                                return result;
                              }))
        .filter(types => types.length > 0)
        .map(types => {
          // dispatch for each array inside types by maximum 3 elements by array
          const result = []
          types.forEach((type, indexType) => {
            result[indexType] = []
            let i = 0
            while (i < type.length) {
              result[indexType].push(type.slice(i, i+3))
              i += 3
            }
          })
          return result.flat()
        }).flat()
        .forEach(plank => {
          // dispatch between garden and greenhouse
          if (plank[0].garden) {
            if (!('gardens' in res)) {
              res.gardens = []
            }
            res.gardens.push(plank)
          } else {
            if (!('greenhouse' in res)) {
              res.greenhouse = []
            }
            res.greenhouse.push(plank)
          }
        })
    return res
  },
  getPlanificationOptimized(state, getters) {
      /*
      return object of array[n] of array[3] of array[k] of objects
      n is size number of gardens or greenhouses
      3 is size of plank
      k is number of species in plank, each species have two specifics elements: week_start_recolte and week_end_recolte, week_start_semis and week_end_semis

      Example:
      {
        gardens: [ (size n)
          [ // plank 1 (size 3)
            [ // species in plank
              {
                index
                week_start_recolte
                month_start_recolte
                week_end_recolte
                month_end_recolte
                week_start_semis
                month_start_semis
                week_end_semis
                month_end_semis
                specie_name
                garden
                uuid
              },
              {
                index
                week_start_recolte
                month_start_recolte
                week_end_recolte
                month_end_recolte
                week_start_semis
                month_start_semis
                week_end_semis
                month_end_semis
                specie_name
                garden
                uuid
              },
            ]
          ]
        ],
        greenhouse: []
      }

      fr rules:
        Succéder selon période semis / récolte et durée en champs 
        Serre ou Plein Champs -> les variétés de plein champ peuvent aller en serre mais les variétés en serres ne peuvent pas aller en plein champ
        Ne pas mettre 2 fois la même famille sur une planche
        Alterner fertilisation forte puis moyenne puis faible
        Une fertilisation forte peut suivre une fertilisation faible
    */

    const ruleFertilization = {
      high: {
        index: 0,
        match_with: [1, 3]
      }, // need to match with 3 and 1
      medium: {
        index: 1,
        match_with: [0, 1]
      }, // need to match with 2 and 0
      low: {
        index: 2,
        match_with: [1, 0]
      } // need to match with 1 and 0
    }
    const planificationRaw = getters.getPlanificationRaw
    let gardens = []
    const resultGardens = []
    let greenhouse = []

    if ('gardens' in planificationRaw) {
      gardens = planificationRaw.gardens
    }
    if ('greenhouse' in planificationRaw) {
      greenhouse = planificationRaw.greenhouse
    }

    gardens = gardens.reduce((flat, toFlatten) => flat.concat(toFlatten), [])

    gardens.forEach(currentSpecie => {
      if (resultGardens.length === 0) { // If resultGardens is empty, we add a new array inside
        resultGardens.push([currentSpecie])
      } else { // Else try to add in existing plank
        // generate week_start_recolte and week_end_recolte, week_start_semis and week_end_semis at 0 in currentSpecie
        currentSpecie = {
          ...currentSpecie,
          week_recolte: 0,
          week_semis: 0,
          month_recolte: currentSpecie.month_start_recolte,
          month_semis: currentSpecie.month_start_semis
        }
        // Get planks who not have same specie than currentSpecie
        const indexesGardens = resultGardens.reduce((acc, elmt, index) => {
          if (elmt.find(specie => specie.specie_name !== currentSpecie.specie_name)) {
            acc.push(index)
          }
          return acc;
        }, [])
        if (indexesGardens.length > 0) { // If result is not empty
          // Try too add in plank, with good week's recolte and semis
          const finalResult = {
            index_garden: -1,
            specie: currentSpecie
          }
          for (let i = 0; i < indexesGardens.length; i++) {
            const currentGardens = resultGardens[indexesGardens[i]]
            const res = currentGardens.find(quandidateSpecie => {
              let found = false
              // Know if there are some place for currentSpecie (week's recolte and semis)
              const canSemisAndRecolteBefore = (
                currentSpecie.month_semis < quandidateSpecie.month_semis &&
                currentSpecie.month_recolte < quandidateSpecie.month_semis
              )

              const canSemisAndRecolteAfter = (
                currentSpecie.month_semis > quandidateSpecie.month_recolte &&
                currentSpecie.month_recolte > quandidateSpecie.month_recolte
              )
              
              if (canSemisAndRecolteBefore || canSemisAndRecolteAfter) {
                // Know if we can add with this fertilisation's order high, medium, low occording currentSpecie.fertilisation
                const ruleCurrentFertilization = ruleFertilization[currentSpecie.fertilization];
                console.log("currentSpecie", currentSpecie)
                const indexMatchWithCurrent = (canSemisAndRecolteBefore) ? 0 : 1
                const ruleQuanditateFertilization = ruleFertilization[quandidateSpecie.fertilization];
                console.log("quandidateSpecie", quandidateSpecie)

                const canFertilisation = (
                  ruleCurrentFertilization.match_with[indexMatchWithCurrent] === ruleQuanditateFertilization.index
                );
                if (canFertilisation) {
                  found = true;
                  // found good week and month for recolte and semis
                  finalResult.index_garden = indexesGardens[i] 
                }
              }
              return found
            })
            if (res) break;
          }
          // Else create a new plank
          if (finalResult.index_garden === -1) {
            resultGardens.push([currentSpecie])
          } else {
            resultGardens[finalResult.index_garden].push(currentSpecie)
            resultGardens[finalResult.index_garden].sort((a, b) => {
              const aSum = a.week_start_recolte + a.month_start_recolte
              const bSum = b.week_start_recolte + b.month_start_recolte
              if (aSum < bSum) return -1
              if (aSum > bSum) return 1
              return 0  
            })
          }
        } else {
          resultGardens.push([currentSpecie])
        }
      }
    });
    greenhouse = greenhouse.reduce((flat, toFlatten) => flat.concat(toFlatten), [])

    return {resultGardens, greenhouse}
  },
  getSpeciesQuantity(state) {
    return dataSpecies.map((specie, indexSpecie) => 
      specie.types.map((type, indexType) => {
        const currentSelected = state.speciesSelected.find(specieSelected => specieSelected.index === type.index)
        return (currentSelected) ? currentSelected.quantity : 0;
      })
    )
  },
  getSpeciesDetailed(state, getters) {
    // bind speciesSelected with dataSpecies
    const result = [];
    const speciesQuantity = getters.getSpeciesQuantity
    dataSpecies
            .forEach((species, speciesIndex) => {
              const speciesFiltered = species.types
                                      .filter(type => state.speciesSelected
                                                      .findIndex(specieSelected => specieSelected.index === type.index) > -1)
                                      .map((type, typeIndex) => {
                                        const quantity  = speciesQuantity[speciesIndex][typeIndex]
                                        return {...type, quantity, img_specie: species.src_img}
                                      })
              if (speciesFiltered.length > 0) {
                result.push(...speciesFiltered)
              }
            });
    return result.sort((a, b) => a.family_name)
  },
  getTotalSpeciesSelected(state, getters) {
    const speciesDetailed = getters.getSpeciesDetailed

    const totalPlank = speciesDetailed.reduce((acc, cur) => acc + cur.quantity, 0)
    const etp = ((speciesDetailed.reduce((acc, cur) => acc + cur.it_duration, 0) + 376) / 1600).toFixed(2)
    const sumYield = parseInt(speciesDetailed.reduce((acc, cur) => acc + cur.yield_by_plank * cur.quantity, 0))
    const sumSurface = parseInt(speciesDetailed.reduce((acc, cur) => acc + cur.quantity * 16, 0))

    return {
      etp,
      sumYield,
      sumSurface,
      totalPlank
    }
  }
}

export const state = () => ({
  speciesSelected: [],
})

export const mutations = {
  setSpeciesSelected(state, species) {
    state.speciesSelected = species
    this.$cookies.set('speciesSelected', state.speciesSelected)
  },
  updateQuantity(state, {index, quantity}) {
    if (quantity < 0) return ;

    let copySpeciesSelected = [...state.speciesSelected]
    if (quantity === 0) {
      copySpeciesSelected = copySpeciesSelected.filter(specieSelected => specieSelected.index !== index)
    } else {
        dataSpecies.forEach((specie, indexSpecie) => {
          specie.types.forEach((type, indexType) => {
          if (type.index === index) {
            const indexSpecieSelected = copySpeciesSelected.findIndex(specieSelected => specieSelected.index === index)
            if (indexSpecieSelected > -1) {
              copySpeciesSelected[indexSpecieSelected].quantity = quantity
            } else {
              copySpeciesSelected.push({index, quantity})
            }
          }
        })
      })
    }
    state.speciesSelected = [...copySpeciesSelected]
    this.$cookies.set('speciesSelected', state.speciesSelected)
  }
}

export const actions = {
  nuxtServerInit({ state }, { req }) {
    if (req.headers.cookie) {
      const speciesSelected = this.$cookies.get('speciesSelected')
      state.speciesSelected = speciesSelected || [];
    }
  }
}