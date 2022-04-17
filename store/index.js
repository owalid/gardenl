/* eslint-disable no-console */
import dataSpecies from '~/data/dataSpecies.json';

const inRange = (value, min, max) => value >= min && value <= max;
const getRangeArray = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

const generateNewSolutionsPosition = (solutions, candidatSpecie, currentSpecie, before) => {
  // determine the smallest window to place currentSpecie in candidatSpecie

  const deltaMonthBetweenQuandiadateAndCurrent = getRangeArray(candidatSpecie.month_end_semis, currentSpecie.month_end_recolte);
  
  for (let i = 0; i <= deltaMonthBetweenQuandiadateAndCurrent.length; i++) {
    for (let j = 1; j <= 4; j++) {
      const candidateSolution = candidatSpecie;
      const newSpecieSolution = currentSpecie;
      if (before) {
        candidateSolution.week_recolte += i
        candidateSolution.week_semis += i
        candidateSolution.month_recolte += j
        candidateSolution.month_semis += j
      } else {
        candidateSolution.week_recolte = Math.abs(candidateSolution.week_recolte - i)
        candidateSolution.week_semis = Math.abs(candidateSolution.week_semis - i)
        candidateSolution.month_recolte += j
        candidateSolution.month_semis += j
      }

      solutions.push({
        newCandidateSpecie: candidateSolution,
        newSpecie: newSpecieSolution
      })
    }
  }
  return solutions
}

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
                                    delta_semis: type.delta_semis,
                                    delta_recolte: type.delta_recolte,
                                    time_semis_to_recolte: type.time_semis_to_recolte,
                                    uuid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                                  })
                                }
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
    let resultGardens = []
    let greenhouse = []

    if ('gardens' in planificationRaw) {
      gardens = planificationRaw.gardens
    }
    if ('greenhouse' in planificationRaw) {
      greenhouse = planificationRaw.greenhouse
    }

    gardens = gardens.reduce((flat, toFlatten) => flat.concat(toFlatten), [])

    gardens.forEach(currentSpecie => {
      currentSpecie = {
        ...currentSpecie,
        week_recolte: 1,
        week_semis: 1,
        month_recolte: currentSpecie.month_start_recolte,
        month_semis: currentSpecie.month_start_semis
      }
      if (resultGardens.length === 0) { // If resultGardens is empty, we add a new array inside
        resultGardens.push([currentSpecie])
      } else { // Else try to add in existing plank
        // generate week_start_recolte and week_end_recolte, week_start_semis and week_end_semis at 0 in currentSpecie
        // currentSpecie = {
        //   ...currentSpecie,
        //   week_recolte: 0,
        //   week_semis: 0,
        //   month_recolte: currentSpecie.month_start_recolte,
        //   month_semis: currentSpecie.month_start_semis
        // }
        // Get planks who not have same specie than currentSpecie
        const indexesGardens = resultGardens.reduce((acc, elmt, index) => {
          if (elmt.find(specie => specie.specie_name !== currentSpecie.specie_name)) {
            acc.push(index)
          }
          return acc;
        }, [])
        if (indexesGardens.length > 0) { // If result is not empty
          // Try to add in plank, with good week's recolte and semis
          const finalResult = { index_garden: -1, specie: currentSpecie }
          for (let i = 0; i < indexesGardens.length; i++) {
            const currentPlank = resultGardens[indexesGardens[i]]


          /*
            Two loops must be made:
            - One that generates all solutions by confronting a candidate and a place (1)
            - One that validates solutions (2)
            If the last loop validates according to the species which is before or after where we wish to add the place then we add the species by adjusting the months and weeks of the other species otherwise we pass to the following candidate.
          */ 
            const res = currentPlank.find((candidatSpecie, indexQuandidate) => { // (1)
              let found = false
              let isBefore = false
              let canInsert = false
              let isValidate = false
              let solutions = []

              // Know if there are some place for currentSpecie (week's recolte and semis)
              // if there is a place for a species in the board it is before sowing or after harvesting or its harvesting is during sowing or its sowing is during harvesting
              // here it is necessary to make evolve the species of the currentPlank in the case where we can put the species in the plate (according to the months and then to the week)
              if (currentSpecie.month_semis < candidatSpecie.month_semis && currentSpecie.month_recolte < candidatSpecie.month_semis) { // if before all            
                console.log('before all')
                isBefore = true
                canInsert = true
                solutions.push(
                  {
                    newCandidateSpecie: candidatSpecie,
                    newSpecie: currentSpecie
                  }
                )
              } 
              if (
                (inRange(currentSpecie.month_start_semis, candidatSpecie.month_end_semis, candidatSpecie.month_end_semis)
                  && inRange(currentSpecie.month_start_recolte, candidatSpecie.month_end_recolte, candidatSpecie.month_end_semis))
                || (currentSpecie.month_start_semis < candidatSpecie.month_start_semis
                    && inRange(currentSpecie.month_end_semis, candidatSpecie.month_start_semis, candidatSpecie.month_end_semis))
                ) { // all or partly is in range semis
                  
                  console.log('all is in range semis')
                  solutions = [...generateNewSolutionsPosition(solutions, candidatSpecie, currentSpecie, true)]
                  isBefore = true
                  canInsert = true
              } 
              if (currentSpecie.month_semis > candidatSpecie.month_recolte && currentSpecie.month_recolte > candidatSpecie.month_recolte) { // if after all
                canInsert = true
                solutions.push(
                  {
                    newCandidateSpecie: candidatSpecie,
                    newSpecie: currentSpecie
                  }
                )
              } 
              if (
                (inRange(currentSpecie.month_start_semis, candidatSpecie.month_end_recolte, candidatSpecie.month_end_recolte)
                  && inRange(currentSpecie.month_start_recolte, candidatSpecie.month_end_recolte, candidatSpecie.month_end_recolte))
                || (inRange(currentSpecie.month_end_semis, candidatSpecie.month_start_recolte, candidatSpecie.month_end_recolte) &&
                    currentSpecie.month_start_recolte > candidatSpecie.month_end_recolte)
                ) { // all or partly is in range recolte
                  console.log('all is in range recolte')
                  solutions = [...generateNewSolutionsPosition(solutions, candidatSpecie, currentSpecie, false)]
              } 
              
              if (canInsert) {
                currentPlank.forEach(specieToValidate => { // (2)
                  if (specieToValidate.uuid !== candidatSpecie.uuid) {

                    solutions = solutions.filter(({newSpecie, newCandidateSpecie}) => {

                      const rangeSpecieSolution = getRangeArray(newSpecie.month_semis, newSpecie.month_recolte)
                      const rangeCandidateSolution = getRangeArray(newCandidateSpecie.month_semis, newCandidateSpecie.month_recolte)
                      
                      const recolteSpecieToValidateIsInRangeQuandidate = rangeCandidateSolution.includes(specieToValidate.month_recolte) 
                      const isValidrecolteSpecieToValidateQuandidate = !recolteSpecieToValidateIsInRangeQuandidate || (recolteSpecieToValidateIsInRangeQuandidate && newSpecie.week_recolte !== specieToValidate.week_recolte)

                      const semisSpecieToValidateIsInRangeQuandidate = rangeCandidateSolution.includes(specieToValidate.month_semis) 
                      const isValidsemisSpecieToValidateQuandidate = !semisSpecieToValidateIsInRangeQuandidate || (semisSpecieToValidateIsInRangeQuandidate && newSpecie.week_semis !== specieToValidate.week_semis)

                      const recolteSpecieToValidateIsInRangeSpecie = rangeSpecieSolution.includes(specieToValidate.month_recolte) 
                      const isValidrecolteSpecieToValidateSpecie = !recolteSpecieToValidateIsInRangeSpecie || (recolteSpecieToValidateIsInRangeSpecie && newCandidateSpecie.week_recolte !== specieToValidate.week_recolte)

                      const semisSpecieToValidateIsInRangeSpecie = rangeSpecieSolution.includes(specieToValidate.month_semis) 
                      const isValidsemisSpecieToValidateSpecie = !semisSpecieToValidateIsInRangeSpecie || (semisSpecieToValidateIsInRangeSpecie && newCandidateSpecie.week_semis !== specieToValidate.week_semis)


                      return (
                        isValidrecolteSpecieToValidateQuandidate
                         && isValidsemisSpecieToValidateQuandidate
                         && isValidrecolteSpecieToValidateSpecie
                         && isValidsemisSpecieToValidateSpecie
                      )
                    })
                  }
                })
                isValidate = solutions.length > 0
              }

              if (isValidate) {
                // Know if we can add with this fertilisation's order high, medium, low occording currentSpecie.fertilisation
                const solution = solutions[0]
                const ruleCurrentFertilization = ruleFertilization[solution.newSpecie.fertilization];
                const indexMatchWithCurrent = (isBefore) ? 0 : 1
                const ruleQuanditateFertilization = ruleFertilization[solution.newCandidateSpecie.fertilization];

                const canFertilisation = ruleCurrentFertilization.match_with[indexMatchWithCurrent] === ruleQuanditateFertilization.index;
                if (canFertilisation) {
                  found = true;
                  finalResult.index_garden = indexesGardens[i]
                  resultGardens[indexesGardens[i]][indexQuandidate] = solution.newCandidateSpecie;
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

    resultGardens = [resultGardens]

    const finalResultGardens = []
    resultGardens.forEach((species) => {
      let i = 0
      while (i < species.length) {
        finalResultGardens.push(species.slice(i, i+3))
        i += 3
      }
    })
    return {gardens: finalResultGardens, greenhouse}
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